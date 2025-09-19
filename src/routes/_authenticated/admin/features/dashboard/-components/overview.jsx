import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A bar chart'

const chartConfig = {
  student: {
    label: 'Student',
    color: 'var(--chart-1)',
  },
}
export function ChartBarDefault({ monthlyEnrollments }) {
  const chartData = [
    {
      month: monthlyEnrollments.pastSixMonths[0],
      student: monthlyEnrollments.monthlyCounts[0],
    },
    {
      month: monthlyEnrollments.pastSixMonths[1],
      student: monthlyEnrollments.monthlyCounts[1],
    },
    {
      month: monthlyEnrollments.pastSixMonths[2],
      student: monthlyEnrollments.monthlyCounts[2],
    },
    {
      month: monthlyEnrollments.pastSixMonths[3],
      student: monthlyEnrollments.monthlyCounts[3],
    },
    {
      month: monthlyEnrollments.pastSixMonths[4],
      student: monthlyEnrollments.monthlyCounts[4],
    },
    {
      month: monthlyEnrollments.pastSixMonths[5],
      student: monthlyEnrollments.monthlyCounts[5],
    },
  ]
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Enrolled Students</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='student' fill='var(--chart-1)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium'>
          Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
