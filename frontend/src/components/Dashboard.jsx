import ScoreGauge     from "./ScoreGauge"
import KeywordBadges  from "./KeywordBadges"
import SectionScores  from "./SectionScores"
import SuggestionCard from "./SuggestionCard"
import { DEMO_RESULTS } from "../demoData"

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
  const d = DEMO_RESULTS

  return (
    <div className="w-full max-w-5xl mx-auto mt-10">

      {/* ── Header Divider ── */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-gray-400 text-sm font-medium px-3">
          📊 Analysis Results
        </span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      {/* ── Row 1: Score Gauge + 3 Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        {/* Gauge */}
        <div className="md:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-gray-700 transition-colors">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
            ATS Score
          </p>
          <ScoreGauge score={d.score} />
        </div>

        {/* 3 stat cards */}
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

      {/* ── Row 2: Keywords + Section Scores ── */}
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

      {/* ── Row 3: AI Suggestions ── */}
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

    </div>
  )
}

export default Dashboard