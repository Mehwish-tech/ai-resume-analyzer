
import { useEffect, useState } from "react"

function ScoreGauge({ score }) {
  const [displayed, setDisplayed] = useState(0)

  // Animate number counting up
  useEffect(() => {
    let start = 0
    const step = Math.ceil(score / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= score) { setDisplayed(score); clearInterval(timer) }
      else setDisplayed(start)
    }, 30)
    return () => clearInterval(timer)
  }, [score])

  // SVG circle math
  const radius      = 70
  const stroke      = 10
  const normalised  = radius - stroke / 2
  const circumference = 2 * Math.PI * normalised
  const filled      = circumference - (displayed / 100) * circumference

  // Color based on score
  const color = score >= 75 ? "#22c55e"   // green
              : score >= 50 ? "#f59e0b"   // amber
              :               "#ef4444"   // red

  const label = score >= 75 ? "Great Match"
              : score >= 50 ? "Needs Work"
              :               "Poor Match"

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          {/* Background track */}
          <circle cx="80" cy="80" r={normalised}
            fill="none" stroke="#1f2937"
            strokeWidth={stroke} />
          {/* Animated fill */}
          <circle cx="80" cy="80" r={normalised}
            fill="none" stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={filled}
            style={{ transition: "stroke-dashoffset 0.05s linear" }}
          />
        </svg>
        {/* Score number in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-white">{displayed}</span>
          <span className="text-xs text-gray-400 mt-0.5">out of 100</span>
        </div>
      </div>
      {/* Label badge */}
      <span className="mt-2 px-4 py-1 rounded-full text-sm font-semibold"
        style={{ background: `${color}20`, color }}>
        {label}
      </span>
    </div>
  )
}

export default ScoreGauge