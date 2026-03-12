export default function TopDirectorsCard({ directors, directorImages }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-4">Top Directors</p>
      <div className="grid grid-cols-3 gap-4">
        {directors.slice(0, 3).map((d, index) => (
          <div key={d.director} className="bg-gray-800 rounded-xl p-3 flex flex-col items-center text-center gap-1">
            {directorImages[d.director] ? (
              <img src={directorImages[d.director]} alt={d.director} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-500 text-xl">🎬</div>
            )}
            <span className="font-semibold text-white">{d.director}</span>
            <span className="text-2xl font-bold text-green-400">{d.films_watched}</span>
            <span className="text-xs text-gray-500">films watched</span>
            <span className="text-xs text-gray-400">{d.avg_rating}★ avg</span>
          </div>
        ))}
      </div>
    </div>
  )
}