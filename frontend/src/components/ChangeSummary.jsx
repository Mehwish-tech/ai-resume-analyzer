
function ChangeSummary({ original, improved }) {
  const addedSkills = improved.skills.filter(
    s => !original.skills.includes(s)
  )

  const changes = [
    { icon: "🎯", value: addedSkills.length,    label: "Skills Added" },
    { icon: "📈", value: "40%",                  label: "More Impact" },
    { icon: "🔢", value: improved.experience
                          .flatMap(e => e.bullets).length -
                         original.experience
                          .flatMap(e => e.bullets).length,
      label: "New Bullets" },
    { icon: "🔑", value: "+5",                   label: "Keywords" },
  ]

  return (
    <div className="my-6 bg-gray-900/60 border border-gray-800 rounded-2xl px-6 py-4">
      <p className="text-center text-gray-400 text-xs font-medium uppercase tracking-widest mb-4">
        What the AI improved
      </p>
      <div className="grid grid-cols-4 gap-4">
        {changes.map((c, i) => (
          <div key={i} className="text-center">
            <p className="text-xl mb-1">{c.icon}</p>
            <p className="text-white font-bold text-lg">{c.value}</p>
            <p className="text-gray-500 text-xs">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Added skills list */}
      {addedSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-800 flex flex-wrap gap-2 justify-center">
          <span className="text-gray-500 text-xs self-center">Added:</span>
          {addedSkills.map((s, i) => (
            <span key={i}
              className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20
                         text-green-400 rounded-full">
              + {s}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChangeSummary