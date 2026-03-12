import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Cell } from "recharts"

function ratingColor(rating) {
  const min = 2.5
  const max = 5.0
  const t = Math.max(0, Math.min(1, (rating - min) / (max - min)))
  const hue = Math.round(t * 120)
  return `hsl(${hue}, 85%, 55%)`
}

export default function GenreBreakdown({ genres }) {
    const top10 = genres.slice(0, 10)
  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-1">Genre Breakdown</h2>
      <p className="text-gray-400 text-sm mb-6">What you watch vs. what you actually enjoy</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Films watched by genre */}
        <div>
          <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Most Watched</p>
          <ResponsiveContainer width="100%" height={320}>
           <BarChart data={top10} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="genre"
                width={110}
                stroke="#6b7280"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#f9fafb" }}
                itemStyle={{ color: "#f9fafb" }}
                cursor={{ fill: "#1f2937" }}
                formatter={(value) => [value, "Films"]}
              />
              <Bar dataKey="films_watched" radius={[0, 4, 4, 0]}>
                {genres.map((entry, index) => (
                  <Cell key={index} fill="#3b82f6" fillOpacity={1 - index * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg rating by genre */}
        <div>
          <p className="text-gray-400 text-sm mb-3 uppercase tracking-wider">Avg Rating by Genre</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={top10} layout="vertical" margin={{ left: 20 }}>
              <XAxis type="number" domain={[0, 5]} stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="genre"
                width={110}
                stroke="#6b7280"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
                labelStyle={{ color: "#f9fafb" }}
                itemStyle={{ color: "#f9fafb" }}
                cursor={{ fill: "#1f2937" }}
                formatter={(value) => [value, "Avg Rating"]}
              />
              <Bar dataKey="avg_rating" radius={[0, 4, 4, 0]}>
                {genres.map((entry, index) => (
                  <Cell key={index} fill={ratingColor(entry.avg_rating)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}