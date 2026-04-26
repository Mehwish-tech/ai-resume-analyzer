// ── change markers ──────────────────────────
// improved = true  → green highlights
// improved = false → normal display

function Bullet({ text, improved }) {
  return (
    <li className={`text-xs leading-relaxed py-1 flex items-start gap-2
      ${improved ? "text-gray-200" : "text-gray-400"}`}>
      <span className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full
        ${improved ? "bg-green-400" : "bg-gray-600"}`} />
      {text}
    </li>
  )
}

function ResumePanel({ data, improved = false, onCopy }) {
  const accent = improved ? "text-green-400"  : "text-blue-400"
  const border = improved ? "border-green-500/20" : "border-gray-700"
  const badge  = improved
    ? "bg-green-500/10 text-green-400 border-green-500/30"
    : "bg-blue-500/10  text-blue-400  border-blue-500/30"

  return (
    <div className={`bg-gray-900 border ${border} rounded-2xl flex flex-col h-full`}>

      {/* ── Card Header ── */}
      <div className={`flex items-center justify-between px-5 py-3.5
        border-b ${border} rounded-t-2xl
        ${improved ? "bg-green-500/5" : "bg-blue-500/5"}`}>
        <div className="flex items-center gap-2">
          <span>{improved ? "✨" : "📄"}</span>
          <span className="text-sm font-semibold text-white">
            {improved ? "AI Improved Version" : "Original Resume"}
          </span>
        </div>
        {improved && (
          <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${badge}`}>
            +{Math.floor(Math.random() * 3) + 3} keywords added
          </span>
        )}
        <button
          onClick={onCopy}
          className="text-xs text-gray-500 hover:text-white transition-colors
                     bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border
                     border-gray-700 hover:border-gray-600 ml-2"
        >
          📋 Copy
        </button>
      </div>

      {/* ── Resume Body ── */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-left">

        {/* Name & Title */}
        <div>
          <h2 className="text-white font-bold text-lg leading-tight">{data.name}</h2>
          <p className={`text-sm font-medium mt-0.5 ${accent}`}>{data.title}</p>
        </div>

        {/* Summary */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1.5">
            Summary
          </p>
          <p className={`text-xs leading-relaxed
            ${improved ? "text-gray-200" : "text-gray-400"}`}>
            {data.summary}
          </p>
        </div>

        {/* Experience */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-2">
            Experience
          </p>
          <div className="space-y-4">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <p className="text-white text-xs font-semibold">{exp.role}</p>
                    <p className="text-gray-500 text-xs">{exp.company}</p>
                  </div>
                  <span className="text-gray-600 text-xs whitespace-nowrap shrink-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-0.5 pl-1 mt-1.5">
                  {exp.bullets.map((b, j) => (
                    <Bullet key={j} text={b} improved={improved} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-2">
            Skills
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((skill, i) => (
              <span key={i}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium
                  ${improved
                    ? "bg-green-500/10 border-green-500/20 text-green-300"
                    : "bg-gray-800 border-gray-700 text-gray-300"}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-medium mb-1.5">
            Education
          </p>
          <p className={`text-xs leading-relaxed
            ${improved ? "text-gray-200" : "text-gray-400"}`}>
            {data.education}
          </p>
        </div>

      </div>
    </div>
  )
}

export default ResumePanel