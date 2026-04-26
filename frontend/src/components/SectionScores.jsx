import { useEffect, useState } from "react"

function Bar({ label, score, color, delay }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), delay)
    return () => clearTimeout(t)
  }, [score, delay])

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-semibold" style={{ color }}>
          {score}%
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
    </div>
  )
}

function SectionScores({ sections }) {
  return (
    <div className="w-full">
      {sections.map((s, i) => (
        <Bar key={i} {...s} delay={i * 150} />
      ))}
    </div>
  )
}

export default SectionScores