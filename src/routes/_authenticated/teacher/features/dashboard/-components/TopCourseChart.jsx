
import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Card } from '@/components/ui/card'

ChartJS.register(ArcElement, Tooltip, Legend)

export function TopCourseChart() {
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
    .filter(c => c.name !== topCourse.name)
    .reduce((sum, c) => sum + c.enrollments, 0)

  const data = {
    labels: [topCourse.name, "Other Courses"],
    datasets: [
      {
        data: [topCourse.enrollments, others],
        backgroundColor: ["#2563eb", "#60a5fa"], // Primary and lighter blue for contrast
        borderWidth: 2,
        borderColor: "#1e3a8a", // Darker blue for border
        cutout: "70%",
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
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

  return (
    <Card className="max-w-lg mx-auto bg-white/95 backdrop-blur-sm shadow-[0_4px_6px_rgba(0,0,0,0.05)] rounded-[8px] p-6 relative overflow-hidden transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] hover:scale-[1.02]">
      {/* Background decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>

      <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent drop-shadow-md">
        Top Performing Course (Dummy) 📘
      </h2>
      <div className="flex justify-center">
        <Doughnut data={data} options={options} />
      </div>
    </Card>
  )
}
