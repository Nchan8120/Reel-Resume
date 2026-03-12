export default function ContrarianSummary({ contrarian }) {
  const { avg_difference, films_you_rate_higher, films_you_rate_lower, most_underrated_by_you, most_overrated_by_you } = contrarian

  const total = films_you_rate_higher + films_you_rate_lower
  const higherPct = Math.round((films_you_rate_higher / total) * 100)
  const lowerPct = 100 - higherPct

  const tendencyLabel = avg_difference > 0.2
    ? "You're a generous rater"
    : avg_difference < -0.2
    ? "You're a harsh critic"
    : "You're well-calibrated with the crowd"

  const tendencyColor = avg_difference > 0.2
    ? "text-green-400"
    : avg_difference < -0.2
    ? "text-red-400"
    : "text-blue-400"

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-1">Critic Profile</h2>
      <p className="text-gray-400 text-sm mb-6">How your taste compares to global consensus</p>

      {/* Tendency label */}
      <div className="text-center mb-6">
        <p className={`text-2xl font-bold ${tendencyColor}`}>{tendencyLabel}</p>
        <p className="text-gray-400 text-sm mt-1">
          Average difference from TMDB: {avg_difference > 0 ? "+" : ""}{avg_difference.toFixed(3)} ★
        </p>
      </div>

      {/* Higher vs lower bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Rate higher than crowd ({films_you_rate_higher} films)</span>
          <span>Rate lower than crowd ({films_you_rate_lower} films)</span>
        </div>
        <div className="flex rounded-full overflow-hidden h-4">
          <div
            className="bg-green-500 transition-all"
            style={{ width: `${higherPct}%` }}
          />
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${lowerPct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{higherPct}%</span>
          <span>{lowerPct}%</span>
        </div>
      </div>

      {/* Biggest divergences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-green-400 text-xs uppercase tracking-wider mb-2">Biggest Underrate by Crowd</p>
          <p className="font-semibold">{most_underrated_by_you.title}</p>
          <p className="text-sm text-gray-400 mt-1">
            You: {most_underrated_by_you.rating}★ vs TMDB: {most_underrated_by_you.tmdb_rating_normalized}★
          </p>
          <p className="text-green-400 text-sm">+{most_underrated_by_you.difference.toFixed(2)} difference</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4">
          <p className="text-red-400 text-xs uppercase tracking-wider mb-2">Biggest Overrate by Crowd</p>
          <p className="font-semibold">{most_overrated_by_you.title}</p>
          <p className="text-sm text-gray-400 mt-1">
            You: {most_overrated_by_you.rating}★ vs TMDB: {most_overrated_by_you.tmdb_rating_normalized}★
          </p>
          <p className="text-red-400 text-sm">{most_overrated_by_you.difference.toFixed(2)} difference</p>
        </div>
      </div>
    </div>
  )
}