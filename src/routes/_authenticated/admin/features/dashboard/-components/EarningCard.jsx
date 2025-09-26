import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
// Chart.js configuration
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
// Register chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)

function EarningsCard({ totalEarnings, thisMonthTotal, earnings, months, loading }) {
  const chartConfig = {
    type: "line",
    data: {
      labels: months,
      datasets: [
        {
          label: "Earnings",
          data: earnings,
          fill: true,
          borderColor: "rgb(99, 102, 241)", // Modern indigo
          backgroundColor: "rgba(99, 102, 241, 0.08)", // Subtle gradient fill
          tension: 0.4,
          pointBackgroundColor: "rgb(34, 197, 94)", // Modern green
          pointBorderColor: "rgb(255, 255, 255)",
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: "rgb(34, 197, 94)",
          pointHoverBorderColor: "rgb(255, 255, 255)",
          pointHoverBorderWidth: 3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          titleColor: "#f8fafc",
          bodyColor: "#f8fafc",
          borderColor: "rgba(99, 102, 241, 0.3)",
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: false,
          padding: 12,
        },
      },
      scales: {
        x: {
          ticks: {
            color: "rgb(100, 116, 139)",
            font: { size: 12, weight: "500" },
          },
          grid: { display: false },
          border: { display: false },
        },
        y: {
          ticks: {
            color: "rgb(100, 116, 139)",
            font: { size: 12, weight: "500" },
          },
          grid: {
            color: "rgba(99, 102, 241, 0.08)",
            drawBorder: false,
          },
          border: { display: false },
        },
      },
    },
  }

  return (
    <Card className="group relative overflow-hidden bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 border-0 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 backdrop-blur-sm">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-500/[0.02]" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-transparent rounded-full blur-3xl" />

      {loading ? (
        <CardContent className="relative p-8 space-y-6">
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
            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group/stat relative p-6 rounded-2xl bg-gradient-to-br from-white to-slate-50/80 border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-indigo-200/30 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Earnings</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                  ${totalEarnings}
                </p>
                <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              </div>

              <div className="group/stat relative p-6 rounded-2xl bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-200/40 shadow-lg shadow-emerald-200/20 hover:shadow-xl hover:shadow-emerald-200/40 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-transparent rounded-2xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300" />
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">This Month</p>
                <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                  ${thisMonthTotal}
                </p>
                <div className="absolute top-4 right-4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
            </div>

            {/* Enhanced Chart Container */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white/80 to-slate-50/60 border border-slate-200/50 shadow-inner shadow-slate-200/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.01] to-emerald-500/[0.01] rounded-2xl" />
              <div className="relative w-full h-[280px]">
                <Line data={chartConfig.data} options={chartConfig.options} />
              </div>
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
