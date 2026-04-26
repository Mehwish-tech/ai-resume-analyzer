import ScoreGauge    from "./ScoreGauge"
import KeywordBadges from "./KeywordBadges"
import SectionScores from "./SectionScores"
import SuggestionCard from "./SuggestionCard"

// ── Demo data (Step 10 mein real AI data se replace hoga) ──
const DEMO = {
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
      description: "Docker appears 4 times in the job description but is completely absent from your resume. This is likely causing ATS rejection.",
    },
    {
      icon: "⚠️", type: "warning",
      title: "Quantify your achievements",
      description: 'Replace vague statements like "improved performance" with numbers: "improved API response time by 40%". Numbers catch recruiter eyes.',
    },
    {
      icon: "💡", type: "tip",
      title: "Add an AWS certification or project",
      description: "AWS is mentioned twice in job requirements. Even a personal project using S3 or EC2 would significantly boost your score.",
    },
    {
      icon: "✅", type: "success",
      title: "Strong React & Python match",
      description: "Your core tech stack aligns well with this role. React and Python appear prominently in both your resume and the job description.",
    },
  ],
}

function StatCard({ value, label, sub, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center text-center hover:border-gray-700 transition-colors">
      <span className="text-3xl font-bold mb-1" style={{ color }}>{value}</span>
      <span className="text-white text-sm font-medium">{label}</span>
      <span className="text-gray-500 text-xs mt-0.5">{sub}</span>
    </div>
  )
}

function Dashboard() {
  const d = DEMO

  return (
    <div className="w-full max-w-5xl mx-auto mt-10 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-gray-400 text-sm font-medium px-3">
          📊 Analysis Results
        </span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      {/* ── Row 1 : Gauge + Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        {/* Big Score Card */}
        <div className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-gray-700 transition-colors">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
            ATS Score
          </p>
          <ScoreGauge score={d.score} />
        </div>

        {/* Stat Cards */}
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <StatCard
            value={d.foundKeywords.length}
            label="Keywords Found"
            sub="in your resume"
            color="#22c55e"
          />
          <StatCard
            value={d.missingKeywords.length}
            label="Keywords Missing"
            sub="add these ASAP"
            color="#ef4444"
          />
          <StatCard
            value={`${Math.round(
              d.sections.reduce((a, s) => a + s.score, 0) / d.sections.length
            )}%`}
            label="Avg Section Score"
            sub="across all sections"
            color="#3b82f6"
          />
        </div>
      </div>

      {/* ── Row 2 : Keywords + Section Scores ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <p className="text-white font-semibold text-sm mb-5">
            🔍 Keyword Analysis
          </p>
          <KeywordBadges
            found={d.foundKeywords}
            missing={d.missingKeywords}
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
          <p className="text-white font-semibold text-sm mb-5">
            📋 Section Breakdown
          </p>
          <SectionScores sections={d.sections} />
        </div>

      </div>

      {/* ── Row 3 : AI Suggestions ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-semibold text-sm">
            🤖 AI Improvement Suggestions
          </p>
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            {d.suggestions.length} suggestions
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {d.suggestions.map((s, i) => (
            <SuggestionCard key={i} {...s} />
          ))}
        </div>
      </div>

      {/* ── Export Button (Step 12 mein wire hoga) ── */}
      <div className="flex justify-center mt-8 gap-4">
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-lg shadow-blue-500/20">
          📥 Export Improved Resume
        </button>
        <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold text-sm transition-all hover:scale-105 border border-gray-700">
          🔄 Analyze Another
        </button>
      </div>

    </div>
  )
}

export default Dashboard