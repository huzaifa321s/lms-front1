import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";

export default function CoursesSummary({ total, active, inactive, fetchStatus }) {
  const cards = [
    {
      title: "Total Courses",
      value: total,
      icon: <BookOpen className="w-6 h-6 text-white" />,
      bgClass: "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white",
      shadow: "shadow-lg",
    },
    {
      title: "Active Courses",
      value: active,
      icon: <CheckCircle className="w-6 h-6 text-[#10b981]" />,
      bgClass: "bg-white border border-[#e2e8f0]",
      shadow: "shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20",
    },
    {
      title: "Inactive Courses",
      value: inactive,
      icon: <XCircle className="w-6 h-6 text-[#ef4444]" />,
      bgClass: "bg-white border border-[#e2e8f0]",
      shadow: "shadow-[0_4px_6px_rgba(0,0,0,0.05)] hover:shadow-lg hover:shadow-[#cbd5e1]/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`${card.bgClass} ${card.shadow} rounded-[12px] transition-all duration-300  ${fetchStatus === 'fetching' && 'animate-pulse'}`}
        >
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#1e293b]">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <p className="font-bold text-2xl text-[#1e293b]">{fetchStatus === 'fetching' ? 'Loading...' : card.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}