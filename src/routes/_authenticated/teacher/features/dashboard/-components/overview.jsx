
import React, { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
  Tooltip,
  YAxis,
} from 'recharts';

// Mocked shadcn/ui and lucide-react components
const Card = ({ children, className }) => (
  <div className={`rounded-[8px] border bg-white/95 backdrop-blur-sm shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.1)] ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => <div className="p-6 flex flex-col space-y-1.5">{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-semibold text-[#1e293b] ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;
const CardFooter = ({ children, className }) => <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>;

const ChartContainer = ({ config, children, className }) => (
  <div
    className={`min-h-[250px] sm:min-h-[300px] w-full aspect-video p-0 relative mx-auto ${className}`}
  >
    {children}
  </div>
);

const ChartTooltip = ({ children, ...props }) => (
  <Tooltip {...props}>
    {children}
  </Tooltip>
);

const ChartTooltipContent = ({ formatter, payload, ...props }) => {
  if (!payload || payload.length === 0) return null;
  const value = payload[0].value;
  return (
    <div className="rounded-[8px] border bg-white/95 backdrop-blur-sm px-3 py-2 text-sm shadow-[0_4px_6px_rgba(0,0,0,0.05)] border-[#e2e8f0]">
      <div className="font-medium text-[#1e293b]">
        {formatter(value)}
      </div>
    </div>
  );
};

const TrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#10b981]">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const TrendingDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#ef4444]">
    <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
    <polyline points="16 17 22 17 22 11" />
  </svg>
);

export function ChartBarDefault({ monthlyEnrollments }) {
  const chartConfig = {
    student: {
      label: 'Students',
      color: '#2563eb',
    },
  };

  const chartData = monthlyEnrollments?.pastSixMonths?.map((month, idx) => ({
    month,
    student: monthlyEnrollments.monthlyCounts[idx],
  })) || [];

  // Calculate trend %
  const last = chartData.at(-1)?.student ?? 0;
  const prev = chartData.at(-2)?.student ?? 0;
  const trend = prev > 0 ? (((last - prev) / prev) * 100).toFixed(1) : 0;
  const trendingUp = trend >= 0;

  return (
    <div className="relative group">
      {/* Main Card */}
      <Card className="relative bg-white/95 backdrop-blur-sm">
        {/* Background decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#2563eb]/10 to-[#1d4ed8]/10 rounded-full opacity-20 blur-xl"></div>

        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] rounded-[8px] flex items-center justify-center shadow-[0_4px_6px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                <path d="M3 3V21H21V19H5V3H3ZM7 17H9V10H7V17ZM11 17H13V6H11V17ZM15 17H17V12H15V17Z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent text-xl font-bold">
                Monthly Enrolled Students
              </CardTitle>
            </div>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full"></div>
        </CardHeader>

        <CardContent className="flex w-full min-h-[250px] sm:min-h-[300px]">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e40af" stopOpacity={1} />
                    <stop offset="100%" stopColor="#1e3a8a" stopOpacity={0.9} />
                  </linearGradient>
                </defs>

                <YAxis
                  domain={[0, 60]}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  opacity={0.6}
                />

                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  tickFormatter={(value) => value.slice(0, 3)}
                />

                <ChartTooltip
                  cursor={{ fill: "rgba(37, 99, 235, 0.1)", radius: 4 }}
                  content={
                    <ChartTooltipContent
                      formatter={(value) => [`${value} students`, "Enrolled"]}
                    />
                  }
                />

                <Bar
                  dataKey="student"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  barSize={45}
                  isAnimationActive
                  animationDuration={1000}
                  className="hover:fill-[url(#barGradientHover)] transition-all duration-300"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-3 text-sm border-t border-[#e2e8f0] mt-2">
          <div className="flex items-center gap-2 font-semibold">
            {trendingUp ? (
              <div className="flex items-center gap-2 text-[#10b981]">
                <TrendingUp />
                <span>Trending up by {trend}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#ef4444]">
                <TrendingDown />
                <span>Trending down by {Math.abs(trend)}%</span>
              </div>
            )}
          </div>
          <div className="text-[#64748b] leading-none font-medium">
            📈 Showing enrollments for the last 6 months
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function App() {
  const [monthlyEnrollments, setMonthlyEnrollments] = useState({
    pastSixMonths: ['January', 'February', 'March', 'April', 'May', 'June'],
    monthlyCounts: [28, 35, 42, 38, 51, 58],
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] p-4 sm:p-8 font-sans antialiased">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .recharts-tooltip-wrapper {
            z-index: 1000;
          }
        `}
      </style>
      <div className="w-full max-w-3xl mx-auto flex flex-col space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-transparent mb-2">
            Dashboard Analytics
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] rounded-full mx-auto"></div>
        </div>
        <ChartBarDefault monthlyEnrollments={monthlyEnrollments} />
      </div>
    </div>
  );
}
