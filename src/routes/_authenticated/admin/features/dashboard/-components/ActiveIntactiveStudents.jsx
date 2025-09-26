
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function ActiveInactiveStudents() {
  const data = [
    { name: "Active Students", value: 120 },
    { name: "Inactive Students", value: 45 },
  ]

  const COLORS = ["#2563eb", "#ef4444"] // Primary Blue, Danger Red

  return (
    <Card className="w-full rounded-[12px] bg-white border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
          📈 Active vs Inactive Students (Demo Feature)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  className="drop-shadow-md"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              formatter={(value) => <span style={{ color: "#1e293b" }}>{value}</span>} 
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
