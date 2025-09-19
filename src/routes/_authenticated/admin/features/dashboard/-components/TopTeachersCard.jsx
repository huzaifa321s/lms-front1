import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TopTeachersCard({ topTeachers }) {
  // Format Data
  const teachers = topTeachers.map((t) => ({
    name: `${t.firstName} ${t.lastName}`,
    enrollments: t.totalEnrollments,
    avatar: t.avatar || null,
  }))

  return (
   <Card className="w-full rounded-[12px] bg-white border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
          👩‍🏫 Top Teachers
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Chart */}
        <div className="h-64">
  
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teachers}>
              <XAxis dataKey="name" tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "0.5rem",
                  border: "1px solid #E0E7FF",
                }}
                cursor={{ fill: "rgba(99,102,241,0.1)" }}
              />
              <Bar dataKey="enrollments" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>

        {/* Teacher List */}
        <div className="flex flex-col gap-4">
          {teachers.map((t, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 rounded-[8px] bg-white border border-[#e2e8f0] shadow-sm hover:shadow-md hover:bg-[#f8fafc] transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-[#e2e8f0] shadow-sm">
                  <AvatarImage src={t.avatar} alt={t.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white font-semibold">
                    {t.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-[#1e293b]">{t.name}</span>
              </div>
              <span className="font-semibold text-[#2563eb]">{t.enrollments}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
