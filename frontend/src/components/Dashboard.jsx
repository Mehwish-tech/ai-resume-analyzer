// src/components/Dashboard.jsx
import ScoreGauge     from "./ScoreGauge"
import KeywordBadges  from "./KeywordBadges"
import SectionScores  from "./SectionScores"
import SuggestionCard from "./SuggestionCard"

function StatCard({ value, label, sub, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5
                    flex flex-col items-center text-center
                    hover:border-gray-700 transition-colors">
      <span className="text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </span>
      <span className="text-white text-sm font-medium">{label}</span>
      <span className="text-gray-500 text-xs mt-0.5">{sub}</span>
    </div>
  )
}

// ── data prop se real API data aayega ─────────
function Dashboard({ data }) {
  if (!data) return null

  const avgSection = Math.round(
    data.sections.reduce((a, s) => a + s.score, 0) /
    Math.max(data.sections.length, 1)
  )

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-gray-400 text-sm font-medium px-3">
          📊 Analysis Results
        </span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      {/* ── Row 1: Gauge + Stats ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="md:col-span-1 bg-gray-900 border border-gray-800
                        rounded-2xl p-6 flex flex-col items-center
                        justify-center hover:border-gray-700 transition-colors">
          <p className="text-gray-400 text-xs font-medium uppercase
                        tracking-widest mb-4">
            ATS Score
          </p>
          <ScoreGauge score={data.score} />
        </div>

        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <StatCard
            value={data.foundKeywords.length}
            label="Keywords Found"
            sub="in your resume"
            color="#22c55e"
          />
          <StatCard
            value={data.missingKeywords.length}
            label="Keywords Missing"
            sub="add these ASAP"
            color="#ef4444"
          />
          <StatCard
            value={`${avgSection}%`}
            label="Avg Section Score"
            sub="across all sections"
            color="#3b82f6"
          />
        </div>
      </div>

      {/* ── Row 2: Keywords + Sections ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6
                        hover:border-gray-700 transition-colors">
          <p className="text-white font-semibold text-sm mb-5">
            🔍 Keyword Analysis
          </p>
          <KeywordBadges
            found={data.foundKeywords}
            missing={data.missingKeywords}
          />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6
                        hover:border-gray-700 transition-colors">
          <p className="text-white font-semibold text-sm mb-5">
            📋 Section Breakdown
          </p>
          <SectionScores sections={data.sections} />
        </div>

      </div>

      {/* ── Row 3: Suggestions ── */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6
                      hover:border-gray-700 transition-colors">
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-semibold text-sm">
            🤖 AI Improvement Suggestions
          </p>
          <span className="text-xs text-gray-500 bg-gray-800
                           px-3 py-1 rounded-full">
            {data.suggestions.length} suggestions
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.suggestions.map((s, i) => (
            <SuggestionCard key={i} {...s} />
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard