# main.py
from fastapi                 import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv                  import load_dotenv

load_dotenv()

app = FastAPI(
    title       = "AI Resume Analyzer API",
    description = "Analyzes resumes and provides ATS scoring with AI suggestions",
    version     = "1.0.0",
)

# ─────────────────────────────────────────────
# FastAPI app ka main entry point
# Yahan server start hota hai
# ─────────────────────────────────────────────

from fastapi             import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv              import load_dotenv

# .env se API keys load karo
load_dotenv()

app = FastAPI(
    title       = "AI Resume Analyzer API",
    description = "Analyzes resumes and provides ATS scoring with AI suggestions",
    version     = "1.0.0",
)

# ── CORS — React frontend ko allow karo ───────
app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# CORS matlab: browser ko allow karo ke
# localhost:5174 se localhost:8000 pe request kare
app.add_middleware(
    CORSMiddleware,
    allow_origins     = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
    ],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Health check endpoint ──────────────────────
@app.get("/")
def root():
    return {
        "status" : "running",
        "message": "AI Resume Analyzer API is live 🚀",
    }

@app.get("/health")
def health():
    return {"status": "ok"}

# ── Import router (Step 10 mein analyzer add hoga) ──
from routers.analyze import router as analyze_router
app.include_router(analyze_router, prefix="/api")
# from routers.analyze import router as analyze_router
# app.include_router(analyze_router, prefix="/api")