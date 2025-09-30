
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import CountUp from 'react-countup'

export default function TeachersMetrics({ total, active, inactive, fetchStatus }) {
  const metrics = [
    { title: "Total Teachers", value: total, color: "bg-gradient-to-br from-[#2563eb] to-[#1d4ed8]" },
    { title: "Active Teachers", value: active, color: "bg-gradient-to-br from-[#10b981] to-[#059669]" },
    { title: "Inactive Teachers", value: inactive, color: "bg-gradient-to-br from-[#ef4444] to-[#dc2626]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className={`relative rounded-[12px] border border-[#e2e8f0] shadow-[0_4px_6px_rgba(0,0,0,0.05)] ${metric.color} text-white p-3 hover:shadow-lg hover:shadow-[#cbd5e1]/20 transition-all duration-300 ${fetchStatus === 'fetching' && 'animate-pulse'}`}
        >
          <CardHeader className="p-2">
            <CardTitle className="text-sm font-bold text-white">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between py-2 px-2">
            <p className="font-extrabold text-white">{fetchStatus === 'fetching' ? 'loading...' : <CountUp end={metric.value}className="counter-value inline-block" /> }</p>
            <Users className="h-6 w-6 opacity-80" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
