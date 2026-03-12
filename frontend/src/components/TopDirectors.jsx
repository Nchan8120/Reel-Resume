import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function TopDirectors({ directors }) {
  const top10 = directors.slice(0, 10)

  function ratingColor(rating) {
  // rating is 0-5, map to a green->yellow->red gradient
  const min = 2.5
  const max = 4.5
  const t = Math.max(0, Math.min(1, (rating - min) / (max - min)))

  // interpolate from red (0°) through yellow (60°) to green (120°)
  const hue = Math.round(t * 120)
  return `hsl(${hue}, 60%, 60%)`
}

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-1">Top Directors</h2>
      <p className="text-gray-400 text-sm mb-4">By number of films watched</p>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={top10} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="director"
            width={140}
            stroke="#6b7280"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#f9fafb" }}
            cursor={{ fill: "#1f2937" }}
            formatter={(value, name) => [value, name === "films_watched" ? "Films" : name]}
          />
          <Bar dataKey="films_watched" radius={[0, 4, 4, 0]}>
            {top10.map((entry, index) => (
                <Cell key={index} fill={ratingColor(entry.avg_rating)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Rating vs watch count table */}
      <div className="mt-6 border-t border-gray-800 pt-4">
        <p className="text-gray-400 text-sm mb-3">Your ratings breakdown</p>
        <div className="grid grid-cols-3 text-xs text-gray-500 uppercase tracking-wider mb-2 px-2">
          <span>Director</span>
          <span className="text-center">Films</span>
          <span className="text-right">Avg Rating</span>
        </div>
        {top10.map((d) => (
          <div key={d.director} className="grid grid-cols-3 text-sm px-2 py-1.5 rounded hover:bg-gray-800 transition-colors">
            <span className="text-white">{d.director}</span>
            <span className="text-center text-gray-400">{d.films_watched}</span>
            <span className="text-right font-medium"style={{ color: ratingColor(d.avg_rating) }}>
            {d.avg_rating} ★
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}