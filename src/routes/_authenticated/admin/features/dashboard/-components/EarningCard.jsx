
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Line } from "react-chartjs-2"
// Chart.js configuration
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
// Register chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend)
function EarningsCard({ totalEarnings, thisMonthTotal, earnings, months }) {
  const chartConfig = {
  type: 'line',
  data: {
    labels: months,
    datasets: [
      {
        label: "Earnings",
        data: earnings,
        fill: true,
        borderColor: "#2563eb", // Primary Blue
        backgroundColor: "rgba(37,99,235,0.15)", // Primary Blue soft fill
        tension: 0.4, // smooth curve
        pointBackgroundColor: "#10b981", // Success Green points
        pointBorderWidth: 2,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#0d9488",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#2563eb",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
    scales: {
      x: {
        ticks: { color: "#1e293b" }, // Primary text
        grid: { display: false },
      },
      y: {
        ticks: { color: "#1e293b" },
        grid: { color: "rgba(37,99,235,0.1)" },
      },
    },
  },
};
  return (
    <Card className="flex flex-col w-full mx-auto bg-white border border-[#e2e8f0] rounded-[12px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2563eb] to-[#1d4ed8]">
          Earnings Overview
        </CardTitle>
        <CardDescription className="text-[#64748b]">
          Quick snapshot of total and monthly revenue
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        {/* Big Numbers */}
        <div className="flex flex-col sm:flex-row sm:justify-around w-full mb-4">
          <div className="text-center">
            <p className="text-[#94a3b8] text-sm">Total Earnings</p>
            <p className="text-3xl font-bold text-[#2563eb]">${totalEarnings}</p>
          </div>
          <div className="text-center mt-4 sm:mt-0">
            <p className="text-[#94a3b8] text-sm">This Month</p>
            <p className="text-2xl font-semibold text-[#10b981]">${thisMonthTotal}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="relative w-full h-[250px] md:h-[300px]">
          <Line data={chartConfig.data} options={chartConfig.options} />

        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-sm text-[#64748b]">
        <span className="flex items-center gap-1 font-medium text-[#1e293b]">
          Growth Trend <TrendingUp className="h-4 w-4 text-[#2563eb]" />
        </span>
        <span>Compared to last 6 months</span>
      </CardFooter>
    </Card>
  )
}

export default EarningsCard
