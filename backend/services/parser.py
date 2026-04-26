# services/parser.py
# ─────────────────────────────────────────────
# PDF aur DOCX files se text extract karta hai
# ─────────────────────────────────────────────

import pdfplumber
import docx
import io

def extract_text(file_bytes: bytes, filename: str) -> str:
    """
    Resume file se plain text nikalo.
    PDF aur DOCX dono support karta hai.
    """
    filename_lower = filename.lower()

    # ── PDF ──────────────────────────────────
    if filename_lower.endswith(".pdf"):
        return _parse_pdf(file_bytes)

    # ── DOCX ─────────────────────────────────
    elif filename_lower.endswith(".docx"):
        return _parse_docx(file_bytes)

    else:
        raise ValueError(f"Unsupported file type: {filename}")


def _parse_pdf(file_bytes: bytes) -> str:
    """pdfplumber se PDF pages ka text join karo"""
    text_parts = []

    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)

    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise ValueError(
            "Could not extract text from PDF. "
            "Make sure it is not a scanned image."
        )

    return full_text


def _parse_docx(file_bytes: bytes) -> str:
    """python-docx se DOCX paragraphs ka text join karo"""
    doc        = docx.Document(io.BytesIO(file_bytes))
    paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
    full_text  = "\n".join(paragraphs).strip()

    if not full_text:
        raise ValueError("Could not extract text from DOCX file.")

    return full_text


def get_basic_info(resume_text: str) -> dict:
    """
    Resume text se basic info dhundo.
    Simple heuristics — AI wala deep parse Step 10 mein hoga.
    """
    lines = [l.strip() for l in resume_text.split("\n") if l.strip()]

    # Pehli non-empty line usually name hoti hai
    name  = lines[0] if lines else "Candidate"

    # Dusri line usually title hoti hai
    title = lines[1] if len(lines) > 1 else "Professional"

    # Skills keywords dhundo
    skill_keywords = [
        "python", "javascript", "react", "node", "sql", "java",
        "typescript", "docker", "aws", "git", "fastapi", "django",
        "flask", "mongodb", "postgresql", "redis", "graphql",
        "kubernetes", "html", "css", "vue", "angular", "c++", "c#",
    ]

    text_lower     = resume_text.lower()
    found_skills   = [s for s in skill_keywords if s in text_lower]

    return {
        "name"  : name,
        "title" : title,
        "skills": found_skills,
        "raw"   : resume_text,
    }