import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
  { browser: "Electronics", visitors: 275, fill: "var(--chart-1)" },
  { browser: "Beauty", visitors: 200, fill: "var(--chart-2)" },
  { browser: "Appliances", visitors: 287, fill: "var(--chart-3)" },
  { browser: "Furniture", visitors: 173, fill: "var(--chart-4)" },
  { browser: "Watches", visitors: 190, fill: "var(--chart-5)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  Electronics: {
    label: "Electronics",
    color: "var(--chart-1)",
  },
  Beauty: {
    label: "Beauty",
    color: "var(--chart-2)",
  },
  Appliances: {
    label: "Appliances",
    color: "var(--chart-3)",
  },
  Furniture: {
    label: "Furniture",
    color: "var(--chart-4)",
  },
  Watches: {
    label: "Watches",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig
export function OrdersChart() {
  const totalVisitors = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Orders By Category (Dummy)</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
              
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}