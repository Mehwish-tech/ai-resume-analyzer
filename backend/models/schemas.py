# models/schemas.py
# ─────────────────────────────────────────────
# Yeh file define karti hai ke data kaisa dikhega
# Request mein kya aayega, Response mein kya jayega
# ─────────────────────────────────────────────

from pydantic import BaseModel
from typing  import List

# ── What the frontend sends us ────────────────
class AnalyzeRequest(BaseModel):
    job_description: str          # job posting text

# ── Individual resume section score ───────────
class SectionScore(BaseModel):
    label : str
    score : int
    color : str

# ── One AI suggestion card ────────────────────
class Suggestion(BaseModel):
    icon        : str
    type        : str             # critical | warning | tip | success
    title       : str
    description : str

# ── Resume data shape (original + improved) ───
class ResumeData(BaseModel):
    name       : str
    title      : str
    summary    : str
    skills     : List[str]
    education  : str

# ── Full response we send back ────────────────
class AnalyzeResponse(BaseModel):
    score           : int
    foundKeywords   : List[str]
    missingKeywords : List[str]
    sections        : List[SectionScore]
    suggestions     : List[Suggestion]
    original        : dict
    improved        : dict