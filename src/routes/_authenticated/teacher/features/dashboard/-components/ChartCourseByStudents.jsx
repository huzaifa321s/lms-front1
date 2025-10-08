import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

function ChartPieLabel({ dounutData }) {
  if (!dounutData?.studentsCount?.length) {
    return (
      <div className="flex min-h-[300px] w-full items-center justify-center">
        <Card className="p-12 text-center bg-white rounded-[8px] shadow-sm">
          <p className="text-[#1e293b] font-medium">No Students Enrolled Yet</p>
          <p className="text-sm text-[#64748b]">
            Once students enroll, their data will appear here.
          </p>
        </Card>
      </div>
    )
  }

  // total students
  const total = dounutData.studentsCount.reduce((a, b) => a + b, 0)

  // chart data
  const chartData = dounutData.courseLabels.map((label, i) => ({
    name: label,
    value: dounutData.studentsCount[i],
    color:
      dounutData.backgroundColor?.[i] ||
      ["#2563eb", "#60a5fa", "#3b82f6", "#93c5fd", "#1d4ed8"][i % 5],
  }))

  return (
    <Card className="p-6 bg-white rounded-[8px] shadow-sm w-full relative">
      <CardHeader className="text-center">
        <CardTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent text-xl font-bold">
          Courses by Students
        </CardTitle>
        <CardDescription className="text-[#64748b]">
          Distribution of students across your courses
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Donut Chart */}
        <div className="relative w-full lg:w-2/3 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={100}
                outerRadius={140}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  color: "#1e293b",
                }}
                formatter={(value, name) => [`${value} students`, name]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[#1e293b] bg-white font-semibold text-lg px-3 py-1 rounded-md shadow-sm">
              {total} Students
            </span>
          </div>
        </div>

        {/* Breakdown list */}
        <div className="w-full lg:w-1/3 max-h-[350px] overflow-y-auto pr-2">
          <h4 className="text-sm font-semibold text-[#1e293b] mb-3">Course Breakdown</h4>
          <ul className="space-y-2 text-sm">
            {chartData.map((course, i) => {
              const percent = ((course.value / total) * 100).toFixed(1)
              return (
                <li
                  key={i}
                  className="flex items-center gap-3 p-2 rounded-[6px] hover:bg-[#2563eb]/10 transition"
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <span className="truncate text-[#1e293b]">{course.name}</span>
                  <div className="ml-auto text-right">
                    <div className="font-medium text-[#1e293b]">
                      {course.value} student{course.value !== 1 && "s"}
                    </div>
                    <div className="text-xs text-[#64748b]">{percent}%</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-[#e2e8f0] text-sm text-[#64748b]">
        📊 Showing enrolled students across {dounutData.courseLabels.length} courses
      </CardFooter>
    </Card>
  )
}

export default ChartPieLabel
