function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navigation Bar */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <span className="font-bold text-lg">ResumeAI</span>
        </div>
        <span className="text-sm text-gray-400">AI-Powered Resume Analyzer</span>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Analyze Your Resume
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Upload your CV, paste a job description, and get an instant ATS score
          with AI-powered improvement suggestions.
        </p>

        {/* Upload Box — placeholder for now */}
        <div className="border-2 border-dashed border-gray-700 rounded-2xl p-16 w-full max-w-lg hover:border-blue-500 transition-colors cursor-pointer">
          <p className="text-4xl mb-3">📄</p>
          <p className="text-gray-300 font-medium">Drop your resume here</p>
          <p className="text-gray-500 text-sm mt-1">PDF or DOCX — coming in Step 4</p>
        </div>
      </main>

    </div>
  )
}

export default App