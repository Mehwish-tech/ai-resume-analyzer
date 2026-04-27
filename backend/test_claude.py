# test_claude.py — Claude API test karo
import os
from dotenv import load_dotenv
load_dotenv()

from services.ai_service import get_ai_suggestions

# Sample data
result = get_ai_suggestions(
    resume_text = """
    John Doe — React Developer
    
    Summary: Experienced developer with 3 years building web apps.
    
    Experience:
    Frontend Developer at Tech Co (2022-Present)
    - Worked on React applications
    - Fixed bugs and improved performance
    - Participated in code reviews
    
    Skills: React, JavaScript, Python, Git, HTML, CSS
    
    Education: BSc Computer Science, FAST NUCES 2021
    """,
    job_desc    = """
    Senior React Developer needed.
    Requirements: React, TypeScript, Docker, AWS, Redis, GraphQL, Node.js
    Must have 3+ years experience with containerisation and cloud deployment.
    Agile/Scrum experience required.
    """,
    found_kw    = ["React", "JavaScript", "Python", "Git"],
    missing_kw  = ["Docker", "AWS", "Redis", "TypeScript", "GraphQL"],
)

print("\n" + "="*50)
print("CLAUDE AI RESPONSE:")
print("="*50)

print(f"\n📊 Suggestions: {len(result.get('suggestions', []))}")
for s in result.get("suggestions", []):
    print(f"  {s['icon']} [{s['type']}] {s['title']}")

print(f"\n✨ Improved Title: {result.get('improved_title')}")
print(f"\n📝 Improved Summary:\n{result.get('improved_summary')}")
print(f"\n🛠 Improved Skills: {result.get('improved_skills')}")
print(f"\n💼 Improved Bullets:")
for b in result.get("improved_bullets", []):
    print(f"  • {b}")

print(f"\n📋 Section Feedback:")
for k, v in result.get("section_feedback", {}).items():
    print(f"  {k}: {v}")