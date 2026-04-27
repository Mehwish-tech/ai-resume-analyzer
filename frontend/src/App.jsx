// src/App.jsx
import { useState } from "react"
import Navbar       from "./components/Navbar"
import UploadBox    from "./components/UploadBox"
import JobInput     from "./components/JobInput"
import Dashboard    from "./components/Dashboard"
import ResultsPanel from "./components/ResultsPanel"
import { analyzeResume } from "./api"

function App() {
  const [file,          setFile]          = useState(null)
  const [jobDesc,       setJobDesc]       = useState("")
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState("")
  const [results,       setResults]       = useState(null)
  const [loadingMsg,    setLoadingMsg]    = useState("")

  const canAnalyze = file && jobDesc.trim().length > 30

  // ── Loading messages — AI lamba time leta hai ──
  const LOADING_MSGS = [
    "📄 Reading your resume...",
    "🔍 Extracting keywords...",
    "📊 Calculating ATS score...",
    "🤖 Claude AI analyzing...",
    "✨ Building improvements...",
    "🎯 Almost done...",
  ]

  async function handleAnalyze() {
    if (!canAnalyze) return

    setLoading(true)
    setError("")
    setResults(null)

    // ── Cycle through loading messages ─────────
    let msgIndex = 0
    setLoadingMsg(LOADING_MSGS[0])
    const msgTimer = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[msgIndex])
    }, 3000)

    try {
      // ── Real API Call ───────────────────────
      const data = await analyzeResume(file, jobDesc)
      setResults(data)

      // Scroll to results
      setTimeout(() =>
        document.getElementById("results")
          ?.scrollIntoView({ behavior: "smooth" }), 150)

    } catch (err) {
      console.error("Analysis error:", err)

      // ── User-friendly error messages ────────
      if (err.code === "ERR_NETWORK") {
        setError("❌ Cannot connect to backend. Make sure FastAPI is running: uvicorn main:app --reload")
      } else if (err.response?.status === 400) {
        setError("❌ " + (err.response?.data?.detail || "Invalid file type. Use PDF or DOCX."))
      } else if (err.response?.status === 422) {
        setError("❌ " + (err.response?.data?.detail || "Could not read resume text. Try a different file."))
      } else if (err.code === "ECONNABORTED") {
        setError("❌ Request timed out. Try a smaller file or check backend.")
      } else {
        setError("❌ Something went wrong. Check both servers are running.")
      }
    } finally {
      clearInterval(msgTimer)
      setLoading(false)
      setLoadingMsg("")
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* ── Hero ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-blue-500/10
                          border border-blue-500/20 rounded-full px-4 py-1.5
                          text-blue-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full
                             animate-pulse" />
            Powered by Claude AI
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r
                         from-blue-400 via-purple-400 to-pink-400
                         bg-clip-text text-transparent">
            Analyze Your Resume
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload your CV, paste a job description, and get an instant
            ATS score with AI-powered suggestions.
          </p>
        </div>

        {/* ── Upload + Job Description ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UploadBox onFileSelect={setFile} />
          <JobInput  value={jobDesc} onChange={setJobDesc} />
        </div>

        {/* ── Error Message ── */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30
                          rounded-xl px-5 py-4 text-red-400 text-sm
                          text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* ── Analyze Button ── */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className={`px-10 py-4 rounded-2xl font-semibold text-lg
                        transition-all duration-200
              ${canAnalyze && !loading
                ? "bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg shadow-blue-500/25 cursor-pointer"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
          >
            {loading
              ? "🔄 Analyzing..."
              : canAnalyze
              ? "🚀 Analyze My Resume"
              : "Upload CV + paste job description first"}
          </button>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div className="mt-8 max-w-md mx-auto text-center">
            {/* Animated bar */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-blue-500
                              to-purple-500 rounded-full animate-pulse
                              w-3/4" />
            </div>
            {/* Spinning icon */}
            <div className="text-3xl mb-3 animate-spin inline-block">
              ⚙️
            </div>
            <p className="text-gray-400 text-sm font-medium">
              {loadingMsg}
            </p>
            <p className="text-gray-600 text-xs mt-2">
              Claude AI is working — this takes 10–20 seconds
            </p>
          </div>
        )}

        {/* ── Results ── */}
        {results && !loading && (
          <div id="results">
            <Dashboard    data={results} />
            <ResultsPanel data={results} />
          </div>
        )}

      </main>
    </div>
  )
}

export default App