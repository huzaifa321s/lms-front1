
import * as React from "react";
import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Calendar, BarChart3, Target } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Legend,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data and components to make the code runnable in the sandbox environment.
// You should use your actual data and components in your project.


const chartConfig = {
  spending: {
    label: "Spending",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ChartBarLabelCustom({ spendingByYear }) {
const years = useMemo(() => {
  if (spendingByYear && Object.keys(spendingByYear).length > 0) {
    return Object.keys(spendingByYear);
  }
  return [];
}, [spendingByYear]);
  const initialYear = new Date().getFullYear().toString();
  const [currentYear, setCurrentYear] = useState(
    years.includes(initialYear) ? initialYear : years[0]
  );

  // Use useMemo to create the chart data only when dependencies change
  const chartData = useMemo(() => {
    const data = [];
    const months = spendingByYear[currentYear] || {};
    for (const month in months) {
      if (Object.prototype.hasOwnProperty.call(months, month)) {
        data.push({
          year: currentYear,
          month,
          spending: months[month],
        });
      }
    }
    return data;
  }, [spendingByYear, currentYear]);

  // Calculate max spending for the chart domain
  const maxSpending = useMemo(() => {
    if (!chartData.length) return 500;
    const maxVal = Math.max(...chartData.map((d) => d.spending));
    return Math.ceil(maxVal / 100) * 100;
  }, [chartData]);

  // Calculate statistics
  const totalSpending = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.spending, 0);
  }, [chartData]);

  const averageSpending = useMemo(() => {
    return chartData.length > 0 ? Math.round(totalSpending / chartData.length) : 0;
  }, [totalSpending, chartData.length]);

  const highestMonth = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((max, item) => item.spending > max.spending ? item : max);
  }, [chartData]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            Spending Analytics Dashboard
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
            Track and analyze your spending patterns with detailed insights
          </p>
          
          {/* Decorative separator */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Spending */}
          <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl border-0 p-6 hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.2)] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium mb-1 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  Total Spending
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  ${totalSpending.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Average Spending */}
          <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl border-0 p-6 hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.2)] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium mb-1 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  Monthly Average
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  ${averageSpending.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Highest Month */}
          <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl border-0 p-6 hover:shadow-[0_0_25px_5px_rgba(59,130,246,0.2)] transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 font-medium mb-1 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  Highest Month
                </p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                  {highestMonth ? `${highestMonth.month.slice(0, 3)} - $${highestMonth.spending}` : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl group-hover:shadow-lg transition-all duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Chart Card */}
        <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    Monthly Spending Analysis
                  </CardTitle>
                  <CardDescription className="text-slate-600 mt-2 text-lg font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    {chartData.length > 0
                      ? `Detailed breakdown for ${currentYear}`
                      : "Select a year to view spending data"}
                  </CardDescription>
                </div>
              </div>
              
              <div className="shrink-0">
                <Select value={currentYear} onValueChange={setCurrentYear}>
                  <SelectTrigger className="w-48 bg-white/95 border-slate-100 rounded-2xl backdrop-blur-sm hover:bg-white/80 transition-all duration-300 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <SelectValue placeholder="Select a year" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl shadow-2xl backdrop-blur-sm bg-white/95 border-slate-100">
                    <SelectGroup>
                      <SelectLabel className="font-semibold text-slate-600 px-4 py-2 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                        Select Year
                      </SelectLabel>
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          className="rounded-xl mx-2 my-1 hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-500 hover:text-white transition-all duration-300 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Decorative separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent mt-6"></div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-xl border-slate-100 p-6">
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <BarChart
                  accessibilityLayer
                  data={chartData}
                  layout="vertical"
                  margin={{ right: 50, left: 10 }}
                >
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" /> {/* blue-600 */}
                      <stop offset="100%" stopColor="#4f46e5" /> {/* indigo-600 */}
                    </linearGradient>
                  </defs>
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.3)" />
                  <YAxis
                    dataKey="month"
                    type="category"
                    tickLine={false}
                    tickMargin={15}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                    className="text-sm font-medium text-slate-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]"
                  />
                  <XAxis
                    dataKey="spending"
                    type="number"
                    domain={[0, maxSpending]}
                    tickLine={false}
                    axisLine={false}
                    className="text-sm text-slate-600 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]"
                  />
                  <ChartTooltip
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)', radius: 8 }} 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="backdrop-blur-sm bg-white/95 rounded-2xl shadow-2xl border-slate-100 p-4">
                            <p className="font-semibold text-slate-800 mb-2 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                              {label}
                            </p>
                            <p className="text-blue-600 font-bold text-lg font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                              ${payload[0].value.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="spending"
                    name="Monthly Spending"
                    fill="url(#gradient)"
                    radius={12}
                    barSize={32}
                  >
                    <LabelList
                      dataKey="spending"
                      position="right"
                      className="text-sm font-semibold font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]"
                      formatter={(value) => `$${value.toLocaleString()}`}
                      fill="#3b82f6" 
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm p-6 border-t border-slate-100">
            <div className="w-full space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    Trending up by 5.2% this month
                  </p>
                  <p className="text-slate-600 text-sm font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    Showing total spending patterns for {currentYear}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    Peak Spending
                  </p>
                  <p className="font-bold text-lg bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    ${Math.max(...chartData.map(d => d.spending), 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    Data Points
                  </p>
                  <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    {chartData.length} Months
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-1 font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    Year Selected
                  </p>
                  <p className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-[Segoe UI, Tahoma, Geneva, Verdana, sans-serif]">
                    {currentYear}
                  </p>
                </div>
              </div>
            </div>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}