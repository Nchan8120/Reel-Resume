export default function TopGenresCard({ genres }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Top Genres</p>
      <div className="flex flex-col gap-3">
        {genres.map((g, index) => (
          <div key={g.genre} className="flex items-center gap-4">
            <span className="text-lg font-bold text-gray-600 w-6">#{index + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-white">{g.genre}</span>
                <span className="text-sm text-gray-400">{g.avg_rating}★</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-green-500"
                  style={{ width: `${(g.films_watched / genres[0].films_watched) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{g.films_watched} films</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}