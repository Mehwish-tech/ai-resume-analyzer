function JobInput({ value, onChange }) {
  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium">💼 Job Description</p>
        <span className={`text-xs ${wordCount > 50 ? "text-green-400" : "text-gray-600"}`}>
          {wordCount} words {wordCount > 50 ? "✓" : "(add more for better results)"}
        </span>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here...

Example:
We are looking for a React Developer with 2+ years experience.
Skills required: JavaScript, React, Node.js, REST APIs...

The more detail you paste, the better the AI can match your resume."
        className="w-full h-64 bg-gray-900 border border-gray-700 rounded-2xl p-4 text-white text-sm
                   placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500
                   focus:bg-gray-900/80 transition-all duration-200 leading-relaxed"
      />

      {/* Tip */}
      {wordCount === 0 && (
        <p className="text-gray-600 text-xs mt-2 pl-1">
          💡 Tip: Copy the entire job posting — requirements, responsibilities, everything.
        </p>
      )}
    </div>
  )
}

export default JobInput