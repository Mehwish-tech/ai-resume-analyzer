import { useState } from "react"
import Navbar       from "./components/Navbar"
import UploadBox    from "./components/UploadBox"
import JobInput     from "./components/JobInput"
import Dashboard    from "./components/Dashboard"
import ResultsPanel from "./components/ResultsPanel"

function App() {
  const [file, setFile]               = useState(null)
  const [jobDesc, setJobDesc]         = useState("")
  const [loading, setLoading]         = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  // Button active only when both fields filled
  const canAnalyze = file && jobDesc.trim().length > 30

  function handleAnalyze() {
    if (!canAnalyze) return
    setLoading(true)
    setShowDashboard(false)

    // Simulated delay — real API call comes in Step 11
    setTimeout(() => {
      setLoading(false)
      setShowDashboard(true)
      // Smooth scroll to results
      setTimeout(() =>
        document.getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" }), 100)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Analyze Your Resume
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload your CV, paste a job description, and get an instant ATS score
            with AI-powered suggestions.
          </p>
        </div>

        {/* ── Upload + Job Description ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UploadBox onFileSelect={setFile} />
          <JobInput  value={jobDesc} onChange={setJobDesc} />
        </div>

        {/* ── Analyze Button ── */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className={`px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-200
              ${canAnalyze && !loading
                ? "bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg shadow-blue-500/25 cursor-pointer"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
          >
            {loading
              ? "🔄 Analyzing your resume..."
              : canAnalyze
              ? "🚀 Analyze My Resume"
              : "Upload CV + paste job description first"}
          </button>
        </div>

        {/* ── Loading Bar ── */}
        {loading && (
          <div className="mt-6 max-w-md mx-auto">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-pulse w-3/4" />
            </div>
            <p className="text-center text-gray-500 text-sm mt-3">
              AI is reading your resume...
            </p>
          </div>
        )}

        {/* ── Results (Dashboard + Comparison Panel) ── */}
        {showDashboard && (
          <div id="results">
            <Dashboard />
            <ResultsPanel />
          </div>
        )}

      </main>
    </div>
  )
}

export default App