function KeywordBadges({ found, missing }) {
  return (
    <div className="w-full">

      {/* Found Keywords */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
          <p className="text-sm font-medium text-gray-300">
            Found Keywords
            <span className="ml-2 bg-green-500/15 text-green-400 text-xs px-2 py-0.5 rounded-full">
              {found.length}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {found.map((kw, i) => (
            <span key={i}
              className="px-3 py-1.5 bg-green-500/10 border border-green-500/30
                         text-green-400 text-xs rounded-lg font-medium
                         hover:bg-green-500/20 transition-colors">
              ✓ {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Keywords */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <p className="text-sm font-medium text-gray-300">
            Missing Keywords
            <span className="ml-2 bg-red-500/15 text-red-400 text-xs px-2 py-0.5 rounded-full">
              {missing.length}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {missing.map((kw, i) => (
            <span key={i}
              className="px-3 py-1.5 bg-red-500/10 border border-red-500/30
                         text-red-400 text-xs rounded-lg font-medium
                         hover:bg-red-500/20 transition-colors">
              ✗ {kw}
            </span>
          ))}
        </div>
      </div>

    </div>
  )
}

export default KeywordBadges