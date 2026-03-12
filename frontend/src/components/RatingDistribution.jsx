import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"

export default function RatingDistribution({ distribution }) {
  const data = Object.entries(distribution).map(([rating, count]) => ({
    rating: `${rating}★`,
    count,
  }))

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="rating" stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <YAxis stroke="#6b7280" tick={{ fill: "#9ca3af", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#111827", border: "none", borderRadius: "8px" }}
            labelStyle={{ color: "#f9fafb" }}
            itemStyle={{ color: "#f9fafb" }}
            cursor={{ fill: "#1f2937" }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.count === Math.max(...data.map((d) => d.count)) ? "#22c55e" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}