export default function WatcherProfile({ profile }) {
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="text-7xl">{profile.emoji}</div>
      <div className="flex flex-col gap-2 text-center md:text-left">
        <p className="text-xs text-gray-500 uppercase tracking-wider">Your Watcher Archetype</p>
        <h2 className="text-2xl font-bold text-white">{profile.archetype}</h2>
        <p className="text-gray-400 leading-relaxed max-w-xl">{profile.description}</p>
        <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
          <span className="text-xs bg-gray-800 rounded-full px-3 py-1 text-gray-300">
            Top genre: {profile.top_genre}
          </span>
          <span className="text-xs bg-gray-800 rounded-full px-3 py-1 text-gray-300">
            Avg rating: {profile.avg_rating}★
          </span>
          <span className="text-xs bg-gray-800 rounded-full px-3 py-1 text-gray-300">
            Rewatch rate: {profile.rewatch_rate}%
          </span>
        </div>
      </div>
    </div>
  )
}