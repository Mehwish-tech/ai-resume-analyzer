import { useState } from "react"
import Navbar    from "./components/Navbar"
import UploadBox from "./components/UploadBox"
import JobInput  from "./components/JobInput"

function App() {
  const [file, setFile]         = useState(null)
  const [jobDesc, setJobDesc]   = useState("")
  const [loading, setLoading]   = useState(false)

  // Button is active only when both fields are filled
  const canAnalyze = file && jobDesc.trim().length > 30

  function handleAnalyze() {
    if (!canAnalyze) return
    setLoading(true)
    // Real API call comes in Step 11 — for now just show loading
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-14">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Analyze Your Resume
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Upload your CV, paste a job description, and get an instant ATS score
            with AI-powered suggestions.
          </p>
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <UploadBox onFileSelect={setFile} />
          <JobInput  value={jobDesc} onChange={setJobDesc} />
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || loading}
            className={`
              px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-200
              ${canAnalyze && !loading
                ? "bg-blue-600 hover:bg-blue-500 hover:scale-105 shadow-lg shadow-blue-500/25 cursor-pointer"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"}
            `}
          >
            {loading
              ? "🔄 Analyzing..."
              : canAnalyze
              ? "🚀 Analyze My Resume"
              : "Upload CV + paste job description first"}
          </button>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-8 mt-16">
          {[
            { icon: "📄", label: "Upload CV",       done: !!file },
            { icon: "💼", label: "Add Job Desc",    done: jobDesc.length > 30 },
            { icon: "🤖", label: "Get AI Analysis", done: false },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all
                ${step.done ? "border-green-500 bg-green-500/10" : "border-gray-700 bg-gray-900"}`}>
                {step.icon}
              </div>
              <span className={`text-xs ${step.done ? "text-green-400" : "text-gray-600"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default App