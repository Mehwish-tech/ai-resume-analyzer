// src/demoData.js
// ─────────────────────────────────────────────
// Demo data — Step 10 mein Claude API replace karega
// ─────────────────────────────────────────────

export const DEMO_RESULTS = {
  score: 78,

  foundKeywords  : ["React", "JavaScript", "Python", "REST API",
                    "Git", "FastAPI", "TypeScript", "Agile"],
  missingKeywords: ["Docker", "AWS", "Redis", "GraphQL", "Kubernetes"],

  sections: [
    { label: "Work Experience", score: 85, color: "#3b82f6" },
    { label: "Skills",          score: 70, color: "#8b5cf6" },
    { label: "Education",       score: 95, color: "#22c55e" },
    { label: "Summary / Bio",   score: 55, color: "#f59e0b" },
    { label: "Formatting",      score: 80, color: "#06b6d4" },
  ],

  suggestions: [
    {
      icon: "🚨", type: "critical",
      title: "Add Docker to your Skills section",
      description: "Docker appears 4 times in the job description but is absent from your resume. This is likely causing ATS rejection.",
    },
    {
      icon: "⚠️", type: "warning",
      title: "Quantify your achievements",
      description: 'Replace vague statements like "improved performance" with numbers: "improved API response time by 40%".',
    },
    {
      icon: "💡", type: "tip",
      title: "Add an AWS certification or project",
      description: "AWS is mentioned twice in job requirements. Even a personal S3/EC2 project would boost your score significantly.",
    },
    {
      icon: "✅", type: "success",
      title: "Strong React & Python match",
      description: "Your core tech stack aligns well. React and Python appear prominently in both resume and job description.",
    },
  ],

  // ── Resume comparison data ──────────────────
  original: {
    name    : "John Doe",
    title   : "React Developer",
    summary : "Experienced developer who worked on various web applications and helped improve system performance.",
    experience: [
      {
        role    : "Frontend Developer",
        company : "Tech Solutions Ltd",
        period  : "2022 – Present",
        bullets : [
          "Worked on web applications using React",
          "Helped improve application performance",
          "Participated in team meetings and code reviews",
          "Fixed bugs reported by QA team",
        ],
      },
      {
        role    : "Junior Developer",
        company : "StartupXYZ",
        period  : "2020 – 2022",
        bullets : [
          "Built features for the company website",
          "Worked with REST APIs",
          "Used Git for version control",
        ],
      },
    ],
    skills    : ["React", "JavaScript", "Python", "REST API", "Git", "HTML", "CSS"],
    education : "BSc Computer Science — FAST NUCES, 2020",
  },

  improved: {
    name    : "John Doe",
    title   : "Senior React Developer & Python Engineer",
    summary : "Results-driven Full Stack Developer with 4+ years building scalable React applications and Python backends. Delivered 40% performance improvements and led cross-functional agile teams of 5+ engineers.",
    experience: [
      {
        role    : "Frontend Developer",
        company : "Tech Solutions Ltd",
        period  : "2022 – Present",
        bullets : [
          "Engineered 3 high-traffic React applications serving 50,000+ monthly users",
          "Optimised API response time by 40% through Redis caching and query refactoring",
          "Containerised applications using Docker, reducing deployment time by 60%",
          "Mentored 2 junior developers; conducted weekly code reviews improving code quality by 35%",
        ],
      },
      {
        role    : "Junior Developer",
        company : "StartupXYZ",
        period  : "2020 – 2022",
        bullets : [
          "Developed 8 customer-facing features increasing user retention by 22%",
          "Integrated 5 third-party REST APIs (Stripe, Twilio, SendGrid) into production systems",
          "Managed CI/CD pipelines using GitHub Actions, cutting release cycles from 2 weeks to 3 days",
        ],
      },
    ],
    skills    : ["React", "JavaScript", "TypeScript", "Python", "FastAPI", "Docker",
                 "AWS (S3, EC2)", "Redis", "REST API", "GraphQL", "Git", "Agile/Scrum"],
    education : "BSc Computer Science — FAST NUCES, 2020 | AWS Cloud Practitioner (2023)",
  },
}