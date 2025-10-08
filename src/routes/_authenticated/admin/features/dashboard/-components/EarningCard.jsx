import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import CountUp from "react-countup"

function EarningsCard({ totalEarnings, thisMonthTotal, earnings, months, loading }) {
  // Prepare data for Recharts
  const chartData = months?.map((month, i) => ({
    month,
    earnings: earnings[i] || 0,
  }))

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 backdrop-blur-sm">
      {/* Backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/[0.02]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl" />

      {loading ? (
        <CardContent className="relative p-8 space-y-6">
          {/* Skeleton Loading UI */}
          <div className="space-y-3">
            <div className="h-7 w-48 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" />
            <div className="h-5 w-72 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-lg animate-pulse" />
          </div>
          <div className="flex justify-between pt-4">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse" />
              <div className="h-10 w-32 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded animate-pulse" />
              <div className="h-10 w-28 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-xl animate-pulse" />
            </div>
          </div>
          <div className="h-[280px] w-full bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 rounded-2xl animate-pulse" />
        </CardContent>
      ) : (
        <>
          <CardHeader className="relative pb-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 bg-clip-text text-transparent leading-tight">
              Earnings Overview
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium text-base">
              Real-time revenue insights and growth metrics
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group/stat relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Earnings</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                  ${<CountUp end={totalEarnings} className="counter-value inline-block" />}
                </p>
              </div>

              <div className="group/stat relative p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/40 shadow-lg shadow-emerald-200/20 hover:shadow-xl hover:shadow-emerald-200/40 transition-all duration-300">
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">This Month</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  ${<CountUp end={thisMonthTotal} className="counter-value inline-block" />}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/60 border border-slate-200/50 shadow-inner shadow-slate-200/30 backdrop-blur-sm">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99, 102, 241, 0.08)" />
                  <XAxis dataKey="month" tick={{ fill: "rgb(100,116,139)", fontSize: 12, fontWeight: 500 }} />
                  <YAxis tick={{ fill: "rgb(100,116,139)", fontSize: 12, fontWeight: 500 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.95)",
                      borderRadius: 12,
                      borderColor: "rgba(99, 102, 241, 0.3)",
                    }}
                    itemStyle={{ color: "#f8fafc" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="rgb(99,102,241)"
                    strokeWidth={3}
                    dot={{ fill: "rgb(34,197,94)", r: 6, stroke: "#fff", strokeWidth: 3 }}
                    activeDot={{ r: 8, fill: "rgb(34,197,94)", stroke: "#fff", strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>

          <CardFooter className="relative pt-4 pb-6 px-8">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-emerald-50 border border-indigo-200/40">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <span className="font-semibold text-slate-800 text-sm">Growth Trend</span>
              </div>
              <span className="text-slate-500 font-medium text-sm">Last 6 months comparison</span>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default EarningsCard
