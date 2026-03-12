export default function SummaryBar({ summary, runtime, username}) {
  const stats = [
    ...(username ? [{ label: "Letterboxd User", value: `@${username}` }] : []),
    { label: "Films Watched", value: summary.total_films },
    { label: "Average Rating", value: `${summary.mean_rating} ★` },
    { label: "Hours Watched", value: runtime.total_hours.toLocaleString() },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
      {stats.map((s) => (
        <div key={s.label} className="bg-gray-900 rounded-xl p-4 flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wider">{s.label}</span>
          <span className="text-2xl font-bold">{s.value}</span>
        </div>
      ))}
    </div>
  )
}