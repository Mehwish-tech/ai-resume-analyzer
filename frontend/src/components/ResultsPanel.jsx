import { useState } from "react"
import ResumePanel   from "./ResumePanel"
import ChangeSummary from "./ChangeSummary"
import { DEMO_RESULTS } from "../demoData"

function ResultsPanel() {
  const [copied, setCopied] = useState("")
  const [activeTab, setActiveTab] = useState("comparison") // comparison | tips
  const d = DEMO_RESULTS

  function copyText(type) {
    const data  = type === "original" ? d.original : d.improved
    const text  = [
      data.name, data.title, "",
      "SUMMARY", data.summary, "",
      "EXPERIENCE",
      ...data.experience.flatMap(e => [
        `${e.role} @ ${e.company} (${e.period})`,
        ...e.bullets.map(b => `• ${b}`)
      ]), "",
      "SKILLS", data.skills.join(", "), "",
      "EDUCATION", data.education,
    ].join("\n")

    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(""), 2000)
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">

      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-gray-400 text-sm font-medium px-3">
          ✨ Resume Comparison
        </span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      {/* ── Tab Toggle ── */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit mx-auto mb-6">
        {[
          { key: "comparison", label: "📄 Side by Side" },
          { key: "tips",       label: "💡 Rewrite Tips" },
        ].map(tab => (
          <button key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all
              ${activeTab === tab.key
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Side by Side ── */}
      {activeTab === "comparison" && (
        <>
          {/* Change summary bar */}
          <ChangeSummary original={d.original} improved={d.improved} />

          {/* Two panels */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResumePanel
              data={d.original}
              improved={false}
              onCopy={() => copyText("original")}
            />
            <ResumePanel
              data={d.improved}
              improved={true}
              onCopy={() => copyText("improved")}
            />
          </div>

          {/* Copy feedback toast */}
          {copied && (
            <div className="fixed bottom-6 right-6 bg-green-600 text-white
                            text-sm px-4 py-2.5 rounded-xl shadow-xl animate-bounce">
              ✅ {copied === "original" ? "Original" : "Improved"} resume copied!
            </div>
          )}
        </>
      )}

      {/* ── Tab: Rewrite Tips ── */}
      {activeTab === "tips" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              before: "Worked on web applications using React",
              after : "Engineered 3 React SPAs serving 50,000+ monthly active users",
              rule  : "Add scale & numbers",
            },
            {
              before: "Helped improve application performance",
              after : "Optimised API response time by 40% via Redis caching",
              rule  : "Show the method + result",
            },
            {
              before: "Participated in team meetings and code reviews",
              after : "Mentored 2 junior devs; code reviews cut bug rate by 35%",
              rule  : "Show leadership & impact",
            },
            {
              before: "Fixed bugs reported by QA team",
              after : "Resolved 120+ production bugs, reducing P0 incidents by 80%",
              rule  : "Quantify everything",
            },
            {
              before: "Built features for the company website",
              after : "Delivered 8 revenue-critical features increasing retention 22%",
              rule  : "Tie to business outcomes",
            },
            {
              before: "Used Git for version control",
              after : "Managed CI/CD via GitHub Actions; cut release cycles from 2wk → 3d",
              rule  : "Show process improvement",
            },
          ].map((tip, i) => (
            <div key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4
                         hover:border-gray-700 transition-all">
              <span className="text-xs font-semibold text-blue-400 uppercase
                               tracking-widest mb-3 block">
                Rule: {tip.rule}
              </span>
              <div className="space-y-2">
                <div className="bg-red-500/8 border border-red-500/20 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-medium mb-1">❌ Before</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{tip.before}</p>
                </div>
                <div className="flex justify-center text-gray-600 text-xs">↓</div>
                <div className="bg-green-500/8 border border-green-500/20 rounded-lg p-3">
                  <p className="text-xs text-green-400 font-medium mb-1">✅ After</p>
                  <p className="text-xs text-gray-300 leading-relaxed">{tip.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom Action Bar ── */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => copyText("improved")}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500
                     rounded-xl font-semibold text-sm transition-all hover:scale-105
                     shadow-lg shadow-blue-500/20">
          📋 Copy Improved Resume
        </button>
        <button
          className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-500
                     rounded-xl font-semibold text-sm transition-all hover:scale-105
                     shadow-lg shadow-green-500/20">
          📥 Download as PDF
        </button>
        <button
          className="w-full sm:w-auto px-8 py-3 bg-gray-800 hover:bg-gray-700
                     rounded-xl font-semibold text-sm transition-all border border-gray-700">
          🔄 Analyze Another Resume
        </button>
      </div>

    </div>
  )
}

export default ResultsPanel