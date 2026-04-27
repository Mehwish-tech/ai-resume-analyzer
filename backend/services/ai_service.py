# services/ai_service.py
# ─────────────────────────────────────────────
# Claude API se AI suggestions leta hai
# Step 10 mein fully implement hoga
# ─────────────────────────────────────────────

import os
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
    Claude API ko resume + job desc bhejo.
    AI suggestions + improved resume wapas aao.
    Step 10 mein real API call hogi — abhi smart demo data.
    """

    # ── Check karo API key hai ya nahi ────────
    api_key = os.getenv("ANTHROPIC_API_KEY", "")

    if api_key and api_key != "your_claude_api_key_here":
        # Real API call — Step 10 mein fully implement hoga
        return _call_claude(resume_text, job_desc, missing_kw, api_key)
    else:
        # Demo mode — API key nahi hai to demo data
        return _demo_response(missing_kw)


def _call_claude(resume_text, job_desc, missing_kw, api_key):
    """Real Claude API call"""
    try:
        client = anthropic.Anthropic(api_key=api_key)

        prompt = f"""
You are an expert resume consultant and ATS specialist.

RESUME:
{resume_text[:2000]}

JOB DESCRIPTION:
{job_desc[:1000]}

MISSING KEYWORDS: {', '.join(missing_kw)}

Return a JSON object with exactly this structure:
{{
  "suggestions": [
    {{
      "icon": "🚨",
      "type": "critical",
      "title": "short title",
      "description": "specific advice"
    }}
  ],
  "improved_summary": "rewritten professional summary in 2-3 sentences",
  "improved_skills": ["skill1", "skill2", "skill3"],
  "improved_bullets": [
    "Strong bullet point with numbers and impact",
    "Another improved bullet point"
  ]
}}

Rules:
- Give exactly 4 suggestions (1 critical, 1 warning, 1 tip, 1 success)
- Types must be: critical, warning, tip, success
- improved_summary must be specific to this resume
- improved_skills must include missing keywords where relevant
- improved_bullets must have metrics/numbers
- Return ONLY valid JSON, no extra text
"""

        message = client.messages.create(
            model      = "claude-sonnet-4-20250514",
            max_tokens = 1500,
            messages   = [{"role": "user", "content": prompt}]
        )

        import json
        response_text = message.content[0].text.strip()

        # Clean up if Claude added markdown
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]

        return json.loads(response_text)

    except Exception as e:
        print(f"Claude API error: {e}")
        return _demo_response(missing_kw)


def _demo_response(missing_kw: list) -> dict:
    """Fallback demo response jab API key nahi ho"""
    missing_str = ", ".join(missing_kw[:3]) if missing_kw else "some keywords"

    return {
        "suggestions": [
            {
                "icon"       : "🚨",
                "type"       : "critical",
                "title"      : f"Add {missing_kw[0] if missing_kw else 'missing skills'} immediately",
                "description": f"'{missing_kw[0] if missing_kw else 'Key skill'}' appears multiple times in the job description but is missing from your resume. This is likely causing ATS rejection.",
            },
            {
                "icon"       : "⚠️",
                "type"       : "warning",
                "title"      : "Quantify your achievements",
                "description": "Replace vague statements like 'improved performance' with numbers: 'improved API response time by 40%'. Numbers catch recruiter attention.",
            },
            {
                "icon"       : "💡",
                "type"       : "tip",
                "title"      : f"Add these missing keywords: {missing_str}",
                "description": "These keywords appear in the job description but not in your resume. Add them naturally to your skills section and work experience.",
            },
            {
                "icon"       : "✅",
                "type"       : "success",
                "title"      : "Good resume structure detected",
                "description": "Your resume has clear sections which helps ATS systems parse it correctly. Keep this structure and focus on adding missing keywords.",
            },
        ],
        "improved_summary" : "Results-driven professional with proven experience delivering high-impact solutions. Demonstrated ability to work across full-stack environments with strong problem-solving skills and attention to detail.",
        "improved_skills"  : missing_kw[:6] if missing_kw else ["Python", "React", "Docker"],
        "improved_bullets" : [
            "Engineered scalable solutions serving 10,000+ users, achieving 99.9% uptime",
            "Reduced system latency by 35% through optimized database queries and caching",
            "Led cross-functional team of 4 engineers delivering projects 20% ahead of schedule",
        ],
    }