import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ApexChart({ totalStudents = 0, totalTeachers = 0 }) {
  const chartData = [
    { name: "Teachers", value: totalTeachers, color: "#2563eb", border: "#1d4ed8" },
    { name: "Students", value: totalStudents, color: "#10b981", border: "#0d9488" },
  ];

  return (
    <section className="space-y-6">
      {/* Chart Card */}
      <Card className="flex flex-col w-full mx-auto bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
            Total Registered Teachers & Students
          </CardTitle>
          <CardDescription className="text-[#64748b]">
            Overview of registered users in the system.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 h-[400px] md:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={150}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.border}
                    strokeWidth={2}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  backgroundColor: "#2563eb",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#fff",
                }}
                formatter={(value, name) => [`${value}`, `${name}`]}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                formatter={(value) => (
                  <span style={{ color: "#1e293b", fontWeight: 600 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium text-[#1e293b]">
            Growth Overview <TrendingUp className="h-4 w-4 text-[#2563eb]" />
          </div>
          <div className="text-[#94a3b8] text-sm">
            Total number of registered teachers and students in the LMS.
          </div>
        </CardFooter>
      </Card>

      {/* Button for details */}
      <div className="flex justify-center">
        <Button
          size="sm"
          variant="outline"
          className="rounded-[8px] border-[#e2e8f0] bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0] hover:border-[#cbd5e1] font-semibold focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 shadow-sm hover:shadow-md transition-all duration-300"
        >
          View Detailed Stats
        </Button>
      </div>
    </section>
  );
}

export default ApexChart;
