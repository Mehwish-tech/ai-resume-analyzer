# routers/analyze.py
# ─────────────────────────────────────────────
# POST /api/analyze — main endpoint
# Resume file + job description receive karta hai
# Score + suggestions return karta hai
# ─────────────────────────────────────────────

from fastapi           import APIRouter, UploadFile, File, Form, HTTPException
from services.parser   import extract_text, get_basic_info
from services.scorer   import calculate_ats_score, get_section_scores
from services.ai_service import get_ai_suggestions

router = APIRouter()


@router.post("/analyze")
async def analyze_resume(
    file           : UploadFile = File(...),   # uploaded resume
    job_description: str        = Form(...),   # job posting text
):
    """
    Main analysis endpoint.

    Accepts:
      - file            : PDF or DOCX resume
      - job_description : plain text of job posting

    Returns:
      - ATS score
      - Found + missing keywords
      - Section scores
      - AI suggestions
      - Original + improved resume data
    """

    # ── 1. Validate file type ──────────────────
    filename = file.filename or ""
    if not (filename.endswith(".pdf") or filename.endswith(".docx")):
        raise HTTPException(
            status_code = 400,
            detail      = "Only PDF and DOCX files are supported."
        )

    # ── 2. Read file bytes ─────────────────────
    try:
        file_bytes = await file.read()
    except Exception:
        raise HTTPException(
            status_code = 400,
            detail      = "Could not read uploaded file."
        )

    # ── 3. Extract text from resume ────────────
    try:
        resume_text = extract_text(file_bytes, filename)
    except ValueError as e:
        raise HTTPException(status_code = 422, detail = str(e))

    # ── 4. Get basic info from resume ──────────
    basic_info = get_basic_info(resume_text)

    # ── 5. Calculate ATS score ─────────────────
    score, found_kw, missing_kw = calculate_ats_score(
        resume_text,
        job_description,
    )

    # ── 6. Get section scores ──────────────────
    sections = get_section_scores(resume_text)

    # ── 7. Get AI suggestions ──────────────────
    ai_data = get_ai_suggestions(
        resume_text,
        job_description,
        found_kw,
        missing_kw,
    )

    # ── 8. Build original resume object ────────
    original = {
        "name"      : basic_info["name"],
        "title"     : basic_info["title"],
        "summary"   : _extract_summary(resume_text),
        "experience": _extract_experience(resume_text),
        "skills"    : basic_info["skills"],
        "education" : _extract_education(resume_text),
    }

    # ── 9. Build improved resume object ────────
    improved_skills = list(set(
        basic_info["skills"] +
        ai_data.get("improved_skills", []) +
        found_kw[:4]
    ))

    improved = {
        "name"      : basic_info["name"],
        "title"     : _improve_title(basic_info["title"], found_kw),
        "summary"   : ai_data.get("improved_summary", original["summary"]),
        "experience": _improve_experience(
                          original["experience"],
                          ai_data.get("improved_bullets", [])
                      ),
        "skills"    : improved_skills[:14],
        "education" : original["education"],
    }

    # ── 10. Return full response ────────────────
    return {
        "score"          : score,
        "foundKeywords"  : found_kw,
        "missingKeywords": missing_kw,
        "sections"       : sections,
        "suggestions"    : ai_data.get("suggestions", []),
        "original"       : original,
        "improved"       : improved,
    }


# ── Helper functions ───────────────────────────────────────

def _extract_summary(text: str) -> str:
    """Resume se summary/objective section dhundo"""
    lines  = text.split("\n")
    summary_keywords = ["summary", "objective", "profile", "about"]

    for i, line in enumerate(lines):
        if any(kw in line.lower() for kw in summary_keywords):
            # Agli 2-3 lines summary hogi
            snippet = " ".join(lines[i+1 : i+4]).strip()
            if snippet:
                return snippet[:300]

    # Fallback: pehle 2 lines ke baad ki text
    body = " ".join(lines[2:6]).strip()
    return body[:300] if body else "Experienced professional seeking new opportunities."


def _extract_education(text: str) -> str:
    """Resume se education line dhundo"""
    lines = text.split("\n")
    edu_keywords = ["bachelor", "master", "bsc", "msc", "degree",
                    "university", "college", "b.s", "m.s", "phd"]

    for line in lines:
        if any(kw in line.lower() for kw in edu_keywords):
            return line.strip()

    return "Education details not found"


def _extract_experience(text: str) -> list:
    """
    Resume se experience bullets dhundo.
    Simple heuristic — bullet points nikalo.
    """
    lines   = text.split("\n")
    bullets = []

    for line in lines:
        line = line.strip()
        # Bullet points usually start with - • * or are short action lines
        if line.startswith(("-", "•", "*", "–")) and len(line) > 15:
            bullets.append(line.lstrip("-•*– ").strip())
        elif (len(line) > 30 and len(line) < 200 and
              any(line.lower().startswith(verb) for verb in [
                  "developed","built","created","managed","led","designed",
                  "implemented","improved","increased","reduced","delivered",
                  "launched","worked","helped","supported","maintained"
              ])):
            bullets.append(line)

    if not bullets:
        return [{
            "role"   : "Professional",
            "company": "Previous Company",
            "period" : "Recent",
            "bullets": ["Experience details extracted from resume"],
        }]

    return [{
        "role"   : "Professional Experience",
        "company": "As per resume",
        "period" : "See resume",
        "bullets": bullets[:6],
    }]


def _improve_title(original_title: str, found_kw: list) -> str:
    """Title ko thoda improve karo"""
    seniority_words = ["senior","lead","principal","staff","head"]
    has_seniority   = any(w in original_title.lower() for w in seniority_words)

    if not has_seniority and found_kw:
        return f"Senior {original_title}"

    return original_title


def _improve_experience(original_exp: list, improved_bullets: list) -> list:
    """Original experience mein improved bullets inject karo"""
    if not original_exp:
        return original_exp

    improved = []
    for i, exp in enumerate(original_exp):
        new_exp = dict(exp)
        if i == 0 and improved_bullets:
            # Pehle job mein AI ke improved bullets add karo
            existing = exp.get("bullets", [])
            new_exp["bullets"] = improved_bullets[:3] + existing[3:]
        improved.append(new_exp)

    return improved