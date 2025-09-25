
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

export function ChartPieLabel({ dounutData }) {
  if (dounutData.studentsCount.length < 1) {
    return (
      <div className="flex min-h-full w-full items-center justify-center">
        <Card className="p-12 text-center bg-white/95 backdrop-blur-sm rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
          <p className="text-[#1e293b] font-medium">No Students Enrolled Yet</p>
          <p className="text-sm text-[#64748b]">
            Once students enroll, their data will appear here.
          </p>
        </Card>
      </div>
    )
  }

  const data = {
    labels: dounutData.courseLabels,
    datasets: [
      {
        label: "Students",
        data: dounutData.studentsCount,
        backgroundColor: ["#2563eb", "#60a5fa", "#3b82f6", "#93c5fd", "#1d4ed8"],
        borderWidth: 2,
        borderColor: "#1e3a8a",
        cutout: "80%",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        color: "#1e293b",
        font: { weight: "bold", size: 14, family: "'Inter', sans-serif" },
        formatter: (value, context) => {
          const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${percentage}%`
        },
        anchor: "center",
        align: "center",
      },
      legend: {
        position: "right",
        labels: {
          color: "#64748b",
          font: { size: 14, weight: "500", family: "'Inter', sans-serif" },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#1e293b",
        bodyColor: "#1e293b",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 10,
        callbacks: {
          label: (context) => `${context.label}: ${context.raw} enrollments`,
        },
      },
    },
  }

  const total = dounutData.studentsCount.reduce((a, b) => a + b, 0)

  return (
    <Card className="p-6 bg-white/95 backdrop-blur-sm rounded-[8px] shadow-[0_4px_6px_rgba(0,0,0,0.05)] w-full relative overflow-hidden transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)]">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>

      <CardHeader className="text-center">
        <CardTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent text-2xl font-bold">
          Courses By Students
        </CardTitle>
        <CardDescription className="text-[#64748b]">
          Distribution of students across your courses
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row gap-6 items-center">
        {/* Donut Chart */}
        <div className="w-full lg:w-2/3 h-[400px] relative">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[#1e293b] bg-white font-semibold text-lg">
              {total} Students
            </span>
          </div>
        </div>

        {/* Right-side Course Breakdown */}
        <div className="w-full lg:w-1/3 max-h-[350px] overflow-y-auto pr-2">
          <div className="bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] rounded-[8px] p-4 border border-[#e2e8f0]">
            <h4 className="text-sm font-semibold text-[#1e293b] mb-3">
              Course Breakdown
            </h4>
            <ul className="space-y-3 text-sm">
              {dounutData.courseLabels.map((name, index) => {
                const value = dounutData.studentsCount[index]
                const percent = ((value / total) * 100).toFixed(1)
                return (
                  <li
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-[8px] hover:bg-[#2563eb]/10 transition-all duration-300"
                  >
                    <span
                      className="inline-block h-4 w-4 shrink-0 rounded-full"
                      style={{ backgroundColor: dounutData.backgroundColor[index] }}
                    />
                    <span className="truncate font-medium text-[#1e293b] max-w-[150px]">
                      {name}
                    </span>
                    <div className="ml-auto text-right">
                      <div className="text-[#1e293b] font-semibold">
                        {value} student{value !== 1 && "s"}
                      </div>
                      <div className="text-xs text-[#64748b]">{percent}%</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-[#e2e8f0] pt-4 text-[#64748b] text-sm">
        📊 Showing enrolled students across {dounutData.courseLabels.length} courses
      </CardFooter>
    </Card>
  )
}

export default function App() {
  const dounutData = {
    courseLabels: [
      "Advanced React",
      "Node.js Fundamentals",
      "UI/UX Design",
      "Python Basics",
      "Data Science",
    ],
    studentsCount: [45, 32, 28, 38, 22],
    backgroundColor: ["#2563eb", "#60a5fa", "#3b82f6", "#93c5fd", "#1d4ed8"],
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-8">
      <ChartPieLabel dounutData={dounutData} />
    </div>
  )
}
