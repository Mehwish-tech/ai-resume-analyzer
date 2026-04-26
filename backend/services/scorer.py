# services/scorer.py
# ─────────────────────────────────────────────
# Resume aur Job Description compare karta hai
# ATS score calculate karta hai
# ─────────────────────────────────────────────

import re
from typing import List, Tuple

# ── Common words jo ignore karni hain ─────────
STOP_WORDS = {
    "the","and","for","are","was","were","with","this",
    "that","have","from","they","will","been","their",
    "has","you","not","but","all","can","her","his",
    "our","who","one","had","him","she","how","its",
    "any","may","per","also","each","such","than",
    "into","over","after","must","more","only","both",
    "very","just","well","your","than","about","would",
}

def extract_keywords(text: str, top_n: int = 40) -> List[str]:
    """
    Text se important keywords nikalo.
    Frequency-based approach — zyada baar aane wale words important hain.
    """
    # Lowercase + sirf letters rakho
    words = re.findall(r'\b[a-z][a-z+#.]*\b', text.lower())

    # Stop words hatao, sirf 2+ char wale rakho
    words = [w for w in words if w not in STOP_WORDS and len(w) > 2]

    # Frequency count
    freq: dict = {}
    for w in words:
        freq[w] = freq.get(w, 0) + 1

    # Top N by frequency
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in sorted_words[:top_n]]


def calculate_ats_score(
    resume_text  : str,
    job_desc_text: str,
) -> Tuple[int, List[str], List[str]]:
    """
    ATS score calculate karo (0-100).

    Formula:
      - Keyword match  → 60% weight
      - Resume length  → 20% weight
      - Section check  → 20% weight

    Returns: (score, found_keywords, missing_keywords)
    """
    resume_lower  = resume_text.lower()
    job_keywords  = extract_keywords(job_desc_text, top_n=30)

    # ── 1. Keyword matching (60 points) ───────
    found   = [kw for kw in job_keywords if kw in resume_lower]
    missing = [kw for kw in job_keywords if kw not in resume_lower]

    keyword_score = int((len(found) / max(len(job_keywords), 1)) * 60)

    # ── 2. Length check (20 points) ───────────
    word_count    = len(resume_text.split())
    if   word_count >= 400: length_score = 20
    elif word_count >= 250: length_score = 14
    elif word_count >= 150: length_score = 8
    else:                   length_score = 3

    # ── 3. Section presence (20 points) ───────
    sections_to_check = {
        "experience" : 5,
        "education"  : 5,
        "skills"     : 5,
        "summary"    : 3,
        "project"    : 2,
    }
    section_score = sum(
        pts
        for sec, pts in sections_to_check.items()
        if sec in resume_lower
    )

    # ── Total ─────────────────────────────────
    total = min(keyword_score + length_score + section_score, 100)

    # Keep keywords readable (Title Case)
    found_display   = [kw.title() for kw in found[:12]]
    missing_display = [kw.title() for kw in missing[:8]]

    return total, found_display, missing_display


def get_section_scores(resume_text: str) -> list:
    """
    Resume ke har section ka individual score.
    """
    text = resume_text.lower()

    def score_section(keywords: List[str], weight: int) -> int:
        hits = sum(1 for kw in keywords if kw in text)
        return min(int((hits / max(len(keywords), 1)) * weight) + 40, 100)

    return [
        {
            "label": "Work Experience",
            "score": score_section(
                ["experience","worked","developed","built",
                 "managed","led","created","implemented"], 60),
            "color": "#3b82f6",
        },
        {
            "label": "Skills",
            "score": score_section(
                ["python","javascript","react","sql","git",
                 "docker","aws","node","api"], 60),
            "color": "#8b5cf6",
        },
        {
            "label": "Education",
            "score": score_section(
                ["bachelor","master","degree","university",
                 "college","bsc","msc","computer"], 60),
            "color": "#22c55e",
        },
        {
            "label": "Summary / Bio",
            "score": score_section(
                ["summary","objective","profile","passionate",
                 "experienced","professional"], 60),
            "color": "#f59e0b",
        },
        {
            "label": "Formatting",
            "score": min(
                50 + (10 if len(resume_text) > 300 else 0)
                   + (10 if "\n" in resume_text else 0)
                   + (15 if "•" in resume_text or "-" in resume_text else 0)
                   + (15 if any(c.isdigit() for c in resume_text) else 0),
                100,
            ),
            "color": "#06b6d4",
        },
    ]