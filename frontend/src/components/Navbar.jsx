function Navbar() {
  return (
    <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-50 bg-gray-950/80">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm">
          🤖
        </div>
        <span className="font-bold text-lg text-white">ResumeAI</span>
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-400">AI Ready</span>
      </div>

    </nav>
  )
}

export default Navbar