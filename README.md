# 🤖 AI Resume Analyzer

An intelligent resume analyzer that scores your CV against job descriptions,
identifies missing keywords, and uses AI to suggest improvements.

![Tech Stack](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)

## ✨ Features

- 📄 Upload PDF or DOCX resume
- 🎯 ATS compatibility scoring
- 🔍 Missing keyword detection
- 🤖 AI-powered improvement suggestions
- 📥 Export improved resume as PDF

## 🛠 Tech Stack

| Layer     | Technology          |
|-----------|---------------------|
| Frontend  | React + Vite + Tailwind CSS |
| Backend   | Python + FastAPI    |
| AI        | Claude API (Anthropic) |
| Deployment| Vercel + Render     |

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- Python 3.12+
- Claude API key

### Installation

```bash
# Clone the repo
git clone https://github.com/Mehwish-tech/ai-resume-analyzer.git
cd ai-resume-analyzer

# Setup frontend
cd frontend
npm install
npm run dev

# Setup backend (in a new terminal)
cd backend
python -m venv venv
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📸 Screenshots

*Coming soon*

## 📄 License
MIT