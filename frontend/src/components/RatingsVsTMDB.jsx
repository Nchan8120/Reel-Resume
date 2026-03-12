function ratingColor(diff) {
  // diff ranges from about -3 to +3
  const t = Math.max(0, Math.min(1, (diff + 2) / 4))
  const hue = Math.round(t * 120)
  return `hsl(${hue}, 85%, 55%)`
}

export default function RatingsVsTMDB({ higher, lower }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-1">You vs. The Crowd</h2>
      <p className="text-gray-400 text-sm mb-6">
        Where your taste diverges most from TMDB's average rating
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Films you rate higher */}
        <div>
          <p className="text-green-400 font-medium text-sm mb-3 uppercase tracking-wider">
            Your Hidden Gems ↑
          </p>
          <div className="flex flex-col gap-2">
            {higher.map((film) => (
              <div key={film.title} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2.5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{film.title}</span>
                  <span className="text-xs text-gray-500">{film.year}</span>
                </div>
                <div className="flex items-center gap-3 text-sm shrink-0">
                  <span className="text-gray-400">{film.tmdb_rating_normalized}★</span>
                  <span className="text-gray-600">→</span>
                  <span className="font-semibold" style={{ color: ratingColor(film.difference) }}>
                    {film.rating}★
                  </span>
                  <span className="text-xs text-gray-500 w-10 text-right">
                    +{film.difference.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Films you rate lower */}
        <div>
          <p className="text-red-400 font-medium text-sm mb-3 uppercase tracking-wider">
            Your Hot Takes ↓
          </p>
          <div className="flex flex-col gap-2">
            {[...lower].reverse().map((film) => (
              <div key={film.title} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2.5">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{film.title}</span>
                  <span className="text-xs text-gray-500">{film.year}</span>
                </div>
                <div className="flex items-center gap-3 text-sm shrink-0">
                  <span className="text-gray-400">{film.tmdb_rating_normalized}★</span>
                  <span className="text-gray-600">→</span>
                  <span className="font-semibold" style={{ color: ratingColor(film.difference) }}>
                    {film.rating}★
                  </span>
                  <span className="text-xs text-gray-500 w-10 text-right">
                    {film.difference.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}