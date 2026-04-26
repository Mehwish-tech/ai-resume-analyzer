import { useState, useRef } from "react"

function UploadBox({ onFileSelect }) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile]             = useState(null)
  const [error, setError]           = useState("")
  const [progress, setProgress]     = useState(0)
  const inputRef = useRef(null)

  // ─── Allowed file types ───────────────────────────────
  const ALLOWED = ["application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]

  // ─── Validate & save the file ────────────────────────
  function handleFile(selected) {
    setError("")
    if (!selected) return

    if (!ALLOWED.includes(selected.type)) {
      setError("❌ Only PDF or DOCX files are allowed.")
      return
    }
    if (selected.size > 5 * 1024 * 1024) {          // 5 MB limit
      setError("❌ File must be under 5 MB.")
      return
    }

    setFile(selected)
    simulateProgress()
    onFileSelect(selected)                           // tell App.jsx
  }

  // ─── Fake progress bar (real upload happens in Step 11) ──
  function simulateProgress() {
    setProgress(0)
    let val = 0
    const timer = setInterval(() => {
      val += Math.random() * 18
      if (val >= 100) { val = 100; clearInterval(timer) }
      setProgress(Math.round(val))
    }, 120)
  }

  // ─── Drag events ─────────────────────────────────────
  function onDragOver(e)  { e.preventDefault(); setIsDragging(true)  }
  function onDragLeave()  { setIsDragging(false) }
  function onDrop(e)      { e.preventDefault(); setIsDragging(false)
                            handleFile(e.dataTransfer.files[0]) }

  // ─── Click to browse ─────────────────────────────────
  function onInputChange(e) { handleFile(e.target.files[0]) }
  function removeFile()     { setFile(null); setProgress(0); setError("") }

  return (
    <div className="w-full">
      <p className="text-gray-400 text-sm font-medium mb-2">📄 Your Resume</p>

      {/* Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current.click()}
        className={`
          border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 cursor-pointer
          ${isDragging
            ? "border-blue-400 bg-blue-500/10 scale-[1.02]"
            : file
            ? "border-green-500 bg-green-500/10 cursor-default"
            : "border-gray-700 bg-gray-900 hover:border-blue-500 hover:bg-blue-500/5"}
        `}
      >
        {/* Hidden real file input */}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={onInputChange}
        />

        {/* State: No file yet */}
        {!file && !isDragging && (
          <>
            <p className="text-4xl mb-3">📂</p>
            <p className="text-white font-semibold mb-1">
              Drag & drop your resume here
            </p>
            <p className="text-gray-500 text-sm">or click to browse</p>
            <p className="text-gray-600 text-xs mt-3">PDF or DOCX · Max 5 MB</p>
          </>
        )}

        {/* State: Dragging over */}
        {isDragging && (
          <>
            <p className="text-4xl mb-3">📥</p>
            <p className="text-blue-400 font-semibold">Drop it!</p>
          </>
        )}

        {/* State: File selected */}
        {file && !isDragging && (
          <>
            <p className="text-4xl mb-3">✅</p>
            <p className="text-green-400 font-semibold truncate max-w-xs mx-auto">
              {file.name}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {(file.size / 1024).toFixed(0)} KB
            </p>

            {/* Progress Bar */}
            {progress < 100 && (
              <div className="mt-4 bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
            {progress === 100 && (
              <p className="text-green-500 text-xs mt-3 font-medium">
                ✓ Ready to analyze
              </p>
            )}

            {/* Remove button */}
            <button
              onClick={(e) => { e.stopPropagation(); removeFile() }}
              className="mt-4 text-xs text-gray-500 hover:text-red-400 transition-colors underline"
            >
              Remove file
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-2 pl-1">{error}</p>
      )}
    </div>
  )
}

export default UploadBox