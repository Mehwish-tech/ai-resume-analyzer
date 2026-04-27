// src/components/ResultsPanel.jsx
import { useState } from "react"
import ResumePanel   from "./ResumePanel"
import ChangeSummary from "./ChangeSummary"

function ResultsPanel({ data }) {
  const [copied,    setCopied]    = useState("")
  const [activeTab, setActiveTab] = useState("comparison")

  if (!data) return null

  const { original, improved } = data

  // ── Copy resume as plain text ──────────────
  function copyText(type) {
    const d    = type === "original" ? original : improved
    const text = [
      d.name, d.title, "",
      "SUMMARY", d.summary, "",
      "EXPERIENCE",
      ...(d.experience || []).flatMap(e => [
        `${e.role} @ ${e.company} (${e.period})`,
        ...(e.bullets || []).map(b => `• ${b}`),
      ]),
      "",
      "SKILLS", (d.skills || []).join(", "), "",
      "EDUCATION", d.education,
    ].join("\n")

    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      setTimeout(() => setCopied(""), 2500)
    })
  }

  // ── Before/After rewrite tips ──────────────
  const rewriteTips = [
    {
      rule  : "Add scale & numbers",
      before: "Worked on web applications",
      after : "Engineered 3 React SPAs serving 50,000+ monthly users",
    },
    {
      rule  : "Show method + result",
      before: "Helped improve performance",
      after : "Optimised API response time by 40% via Redis caching",
    },
    {
      rule  : "Show leadership",
      before: "Participated in code reviews",
      after : "Mentored 2 junior devs; reviews cut bug rate by 35%",
    },
    {
      rule  : "Quantify everything",
      before: "Fixed bugs reported by QA",
      after : "Resolved 120+ bugs, reducing P0 incidents by 80%",
    },
    {
      rule  : "Tie to business outcomes",
      before: "Built features for website",
      after : "Delivered 8 features increasing retention by 22%",
    },
    {
      rule  : "Show process improvement",
      before: "Used Git for version control",
      after : "Managed CI/CD via GitHub Actions; cut releases from 2wk→3d",
    },
  ]

  return (
    <div className="w-full max-w-5xl mx-auto mt-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gray-800" />
        <span className="text-gray-400 text-sm font-medium px-3">
          ✨ Resume Comparison
        </span>
        <div className="h-px flex-1 bg-gray-800" />
      </div>

      {/* ── Tab Toggle ── */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800
                      rounded-xl p-1 w-fit mx-auto mb-6">
        {[
          { key: "comparison", label: "📄 Side by Side" },
          { key: "tips",       label: "💡 Rewrite Tips"  },
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
          <ChangeSummary original={original} improved={improved} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResumePanel
              data={original}
              improved={false}
              onCopy={() => copyText("original")}
            />
            <ResumePanel
              data={improved}
              improved={true}
              onCopy={() => copyText("improved")}
            />
          </div>

          {/* Toast */}
          {copied && (
            <div className="fixed bottom-6 right-6 bg-green-600 text-white
                            text-sm px-4 py-2.5 rounded-xl shadow-xl z-50">
              ✅ {copied === "original" ? "Original" : "Improved"} resume copied!
            </div>
          )}
        </>
      )}

      {/* ── Tab: Rewrite Tips ── */}
      {activeTab === "tips" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewriteTips.map((tip, i) => (
            <div key={i}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4
                         hover:border-gray-700 transition-all">
              <span className="text-xs font-semibold text-blue-400
                               uppercase tracking-widest mb-3 block">
                Rule: {tip.rule}
              </span>
              <div className="space-y-2">
                <div className="bg-red-500/8 border border-red-500/20
                                rounded-lg p-3">
                  <p className="text-xs text-red-400 font-medium mb-1">
                    ❌ Before
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {tip.before}
                  </p>
                </div>
                <div className="flex justify-center text-gray-600 text-xs">
                  ↓
                </div>
                <div className="bg-green-500/8 border border-green-500/20
                                rounded-lg p-3">
                  <p className="text-xs text-green-400 font-medium mb-1">
                    ✅ After
                  </p>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {tip.after}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Action Buttons ── */}
      <div className="mt-8 flex flex-col sm:flex-row items-center
                      justify-center gap-3">
        <button
          onClick={() => copyText("improved")}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-500
                     rounded-xl font-semibold text-sm transition-all
                     hover:scale-105 shadow-lg shadow-blue-500/20">
          📋 Copy Improved Resume
        </button>
        <button
          className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-500
                     rounded-xl font-semibold text-sm transition-all
                     hover:scale-105 shadow-lg shadow-green-500/20">
          📥 Download as PDF
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="w-full sm:w-auto px-8 py-3 bg-gray-800 hover:bg-gray-700
                     rounded-xl font-semibold text-sm transition-all
                     border border-gray-700">
          🔄 Analyze Another Resume
        </button>
      </div>

    </div>
  )
}

export default ResultsPanel