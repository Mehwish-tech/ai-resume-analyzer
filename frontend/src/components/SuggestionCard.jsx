function SuggestionCard({ icon, title, description, type }) {
  const styles = {
    critical : "border-red-500/30    bg-red-500/5    text-red-400",
    warning  : "border-amber-500/30  bg-amber-500/5  text-amber-400",
    tip      : "border-blue-500/30   bg-blue-500/5   text-blue-400",
    success  : "border-green-500/30  bg-green-500/5  text-green-400",
  }

  return (
    <div className={`border rounded-xl p-4 ${styles[type]} transition-all hover:scale-[1.01]`}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{icon}</span>
        <div>
          <p className="font-semibold text-white text-sm mb-1">{title}</p>
          <p className="text-gray-400 text-xs leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default SuggestionCard