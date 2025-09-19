
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CategoriesPopularityChart() {
  const data = [
    { category: "Web Dev", enrollments: 120 },
    { category: "Data Science", enrollments: 95 },
    { category: "Design", enrollments: 80 },
    { category: "Business", enrollments: 65 },
    { category: "Marketing", enrollments: 50 },
  ];

  return (
    <Card className="w-full rounded-[12px] bg-white border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
          📊 Course Categories Popularity (Demo Feature)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,99,235,0.2)" />
            <XAxis dataKey="category" tick={{ fill: "#1e293b", fontSize: 12 }} />
            <YAxis tick={{ fill: "#1e293b", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                color: "#1e293b",
              }}
              cursor={{ fill: "rgba(37,99,235,0.1)" }}
            />
            <Legend formatter={(value) => <span style={{ color: "#1e293b" }}>{value}</span>} />
            <Bar dataKey="enrollments" fill="url(#colorEnrollments)" radius={[6, 6, 0, 0]} />
            <defs>
              <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
