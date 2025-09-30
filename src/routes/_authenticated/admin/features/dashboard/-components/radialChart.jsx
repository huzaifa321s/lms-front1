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
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";;

// Chart.js configuration
ChartJS.register(ArcElement, Tooltip, Legend);

 function ApexChart({ totalStudents = 0, totalTeachers = 0 }) {
  const chartConfig = {
  type: 'pie',
  data: {
    labels: ["Teachers", "Students"],
    datasets: [
      {
        label: "Registered Users",
        data: [totalTeachers, totalStudents],
        backgroundColor: ["#2563eb", "#10b981"], // Primary Blue, Success Green
        borderColor: ["#1d4ed8", "#0d9488"],
        borderWidth: 2,
        hoverOffset: 15,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1e293b", // Primary text
          font: { weight: "600" },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#2563eb",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
      },
    },
  },
};
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
          <div className="relative w-full h-full">
          <Pie data={chartConfig.data} options={chartConfig.options} />
         
          </div>
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


export default ApexChart