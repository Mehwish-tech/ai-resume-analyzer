# services/ai_service.py
# ─────────────────────────────────────────────
# Claude AI se resume analysis + improvements
# ─────────────────────────────────────────────

import os
import json
import anthropic
from dotenv import load_dotenv

load_dotenv()


def get_ai_suggestions(
    resume_text : str,
    job_desc    : str,
    found_kw    : list,
    missing_kw  : list,
) -> dict:
    """
    Main function — Claude API call karo.
    Fallback: agar API key nahi hai to smart demo data.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY", "")

    if api_key and api_key != "your_claude_api_key_here":
        print("🤖 Calling Claude API...")
        result = _call_claude(resume_text, job_desc, found_kw, missing_kw, api_key)
        print("✅ Claude responded successfully")
        return result
    else:
        print("⚠️  No API key found — using demo data")
        return _demo_response(missing_kw)


# ── Main Claude Call ───────────────────────────

def _call_claude(
    resume_text : str,
    job_desc    : str,
    found_kw    : list,
    missing_kw  : list,
    api_key     : str,
) -> dict:
    """Claude API ko detailed prompt bhejo, JSON wapas lo"""

    try:
        client = anthropic.Anthropic(api_key=api_key)

        # ── Truncate long texts to save tokens ────
        resume_short  = resume_text[:3000]
        job_desc_short = job_desc[:1500]
        found_str     = ", ".join(found_kw[:10])
        missing_str   = ", ".join(missing_kw[:10])

        prompt = _build_prompt(
            resume_short,
            job_desc_short,
            found_str,
            missing_str,
        )

        # ── API Call ───────────────────────────────
        message = client.messages.create(
            model      = "claude-sonnet-4-20250514",
            max_tokens = 2000,
            messages   = [{
                "role"   : "user",
                "content": prompt,
            }],
        )

        raw = message.content[0].text.strip()
        return _parse_claude_response(raw, missing_kw)

    except anthropic.AuthenticationError:
        print("❌ Invalid API key")
        return _demo_response(missing_kw)

    except anthropic.RateLimitError:
        print("❌ Rate limit hit — using demo data")
        return _demo_response(missing_kw)

    except Exception as e:
        print(f"❌ Claude error: {e}")
        return _demo_response(missing_kw)


# ── Prompt Builder ─────────────────────────────

def _build_prompt(
    resume    : str,
    job_desc  : str,
    found_kw  : str,
    missing_kw: str,
) -> str:
    return f"""You are an expert ATS resume consultant with 10+ years experience helping candidates land jobs at top tech companies.

Analyze this resume against the job description and provide specific, actionable improvements.

═══════════════════════════════
RESUME:
═══════════════════════════════
{resume}

═══════════════════════════════
JOB DESCRIPTION:
═══════════════════════════════
{job_desc}

═══════════════════════════════
ANALYSIS CONTEXT:
═══════════════════════════════
Keywords FOUND in resume    : {found_kw}
Keywords MISSING from resume: {missing_kw}

═══════════════════════════════
YOUR TASK:
═══════════════════════════════
Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):

{{
  "suggestions": [
    {{
      "icon": "🚨",
      "type": "critical",
      "title": "Specific critical issue title",
      "description": "Detailed explanation of the problem and exactly how to fix it"
    }},
    {{
      "icon": "⚠️",
      "type": "warning",
      "title": "Specific warning title",
      "description": "What needs improvement and specific steps to improve it"
    }},
    {{
      "icon": "💡",
      "type": "tip",
      "title": "Specific tip title",
      "description": "Actionable tip specific to this resume and job description"
    }},
    {{
      "icon": "✅",
      "type": "success",
      "title": "What is working well",
      "description": "Specific positive feedback about what matches well"
    }}
  ],
  "improved_title": "Enhanced job title that better matches the role",
  "improved_summary": "A powerful 2-3 sentence professional summary with specific metrics, key skills from the job description, and strong action language. Make it specific to this person's background.",
  "improved_skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "improved_bullets": [
    "Strong achievement bullet with specific metric (e.g. Increased X by Y% using Z technology)",
    "Another strong bullet showing leadership or impact with numbers",
    "Third bullet demonstrating technical depth relevant to the job description"
  ],
  "section_feedback": {{
    "experience": "Specific feedback on experience section",
    "skills": "Specific feedback on skills section",
    "education": "Specific feedback on education section",
    "summary": "Specific feedback on summary/objective section"
  }}
}}

RULES:
1. suggestions must have exactly 4 items — one of each type
2. improved_skills must include the missing keywords where genuinely relevant
3. improved_bullets must have real numbers/percentages (estimate if needed)
4. improved_summary must reference technologies from BOTH the resume AND job description
5. Be specific — generic advice is useless
6. Return ONLY the JSON object — no ```json wrapper, no explanation text"""


# ── Response Parser ────────────────────────────

def _parse_claude_response(raw: str, missing_kw: list) -> dict:
    """
    Claude ke response ko parse karo.
    Multiple fallback strategies.
    """

    # ── Strategy 1: Direct JSON parse ─────────
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # ── Strategy 2: Extract JSON from markdown ─
    try:
        # ```json ... ``` block dhundo
        if "```" in raw:
            parts = raw.split("```")
            for part in parts:
                part = part.strip()
                if part.startswith("json"):
                    part = part[4:].strip()
                try:
                    return json.loads(part)
                except Exception:
                    continue
    except Exception:
        pass

    # ── Strategy 3: Find { } block ────────────
    try:
        start = raw.index("{")
        end   = raw.rindex("}") + 1
        return json.loads(raw[start:end])
    except Exception:
        pass

    # ── Fallback: Demo data ────────────────────
    print("⚠️  Could not parse Claude response — using demo")
    return _demo_response(missing_kw)


# ── Demo / Fallback Data ───────────────────────

def _demo_response(missing_kw: list) -> dict:
    """
    Jab Claude API nahi ho ya fail ho.
    Smart demo data based on actual missing keywords.
    """
    top_missing = missing_kw[:3] if missing_kw else ["Docker", "AWS", "Redis"]
    first       = top_missing[0] if top_missing else "key skill"
    missing_str = ", ".join(top_missing)

    return {
        "suggestions": [
            {
                "icon"       : "🚨",
                "type"       : "critical",
                "title"      : f"Add '{first}' — appears 3+ times in job description",
                "description": f"'{first}' is a core requirement but missing from your resume entirely. Add it to your skills section and mention it in at least one work experience bullet point.",
            },
            {
                "icon"       : "⚠️",
                "type"       : "warning",
                "title"      : "Replace weak verbs with strong action verbs",
                "description": "Replace 'worked on', 'helped with', 'participated in' with power verbs: 'Engineered', 'Architected', 'Spearheaded', 'Optimised'. This dramatically increases recruiter attention.",
            },
            {
                "icon"       : "💡",
                "type"       : "tip",
                "title"      : f"Weave these keywords naturally: {missing_str}",
                "description": f"Add {missing_str} to your Skills section. Then mention at least one in a work experience bullet: 'Containerised app using {top_missing[0]} reducing deployment time by 60%'.",
            },
            {
                "icon"       : "✅",
                "type"       : "success",
                "title"      : "Resume structure is ATS-friendly",
                "description": "Your resume has clear sections (Experience, Skills, Education) which ATS systems can parse correctly. This is a strong foundation — now focus on keyword optimisation.",
            },
        ],
        "improved_title"  : "Senior Software Engineer",
        "improved_summary": "Results-driven Software Engineer with 3+ years building scalable web applications using modern technologies. Proven track record of delivering high-impact features that improve user experience and system performance. Passionate about clean code, agile practices, and continuous learning.",
        "improved_skills" : top_missing + ["Python", "React", "JavaScript", "Git", "REST API"],
        "improved_bullets": [
            f"Containerised microservices using {top_missing[0]}, reducing deployment time by 65% and eliminating environment inconsistencies",
            "Engineered React dashboard handling 50,000+ monthly active users with 99.9% uptime and sub-200ms load times",
            "Optimised PostgreSQL queries reducing API response time by 40% and cutting infrastructure costs by $2,000/month",
        ],
        "section_feedback": {
            "experience": "Add quantified achievements with specific metrics (%, $, time saved, users served)",
            "skills"    : f"Add these missing keywords: {missing_str}",
            "education" : "Consider adding relevant certifications to strengthen your profile",
            "summary"   : "Add a 2-3 line professional summary at the top targeting this specific role",
        },
    }