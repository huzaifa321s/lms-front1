import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card } from "@/components/ui/card"

function TopCourseChart() {
  const courses = [
    { name: "React Basics", enrollments: 85 },
    { name: "Advanced Node.js", enrollments: 60 },
    { name: "MongoDB Mastery", enrollments: 45 },
    { name: "TailwindCSS UI", enrollments: 30 },
    { name: "Next.js Crash Course", enrollments: 95 },
    { name: "Python for Beginners", enrollments: 70 },
  ]

  // Find top course
  const topCourse = courses.reduce((max, c) =>
    c.enrollments > max.enrollments ? c : max
  )

  // Sum enrollments of other courses
  const others = courses
    .filter((c) => c.name !== topCourse.name)
    .reduce((sum, c) => sum + c.enrollments, 0)

  // Chart data
  const chartData = [
    { name: topCourse.name, value: topCourse.enrollments, color: "#2563eb" },
    { name: "Other Courses", value: others, color: "#60a5fa" },
  ]

  return (
 <Card className="mx-auto bg-white/95 backdrop-blur-sm shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-[8px] p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02] h-[630px] flex flex-col justify-between">
  {/* Decorative Backgrounds */}
  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>
  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>

  {/* Header */}
  <div className="text-center">
    <h2 className="text-xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent drop-shadow-md">
      Top Performing Course (Demo Feature) 📘
    </h2>
    <p className="text-sm text-gray-500 mt-1">Based on total enrollments</p>
  </div>

  {/* Chart Section */}
  <div className="flex-1 flex justify-center items-center">
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={130}
          paddingAngle={2}
          dataKey="value"
        >
          {chartData.map((entry, i) => (
            <Cell
              key={`cell-${i}`}
              fill={entry.color}
              stroke="#1e3a8a"
              strokeWidth={2}
            />
          ))}
        </Pie>

        {/* Tooltip */}
        <Tooltip
          contentStyle={{
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            color: "#1e293b",
          }}
          formatter={(value, name) => [`${value} enrollments`, name]}
        />

        {/* Legend */}
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span
              style={{
                color: "#64748b",
                fontSize: 14,
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  </div>
</Card>

  )
}

export default TopCourseChart
