import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import type { GetDailyGoalsResponse } from "@/http/get-daily-goals"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


export const description = "A multiple bar chart"

interface DailyGoalsProps {
  dailyChart: GetDailyGoalsResponse["dailyChart"];
}

export function DailyGoals({ dailyChart }: DailyGoalsProps) {
  const chartData = dailyChart.map((item) => ({
    day: item.date, 
    Total: item.total,
    Completed: item.completed, 
  }));

  
  const chartConfig = {
    Total: {
      label: "Total",
      color: "hsl(var(--chart-1))",
    },
    Completed: {
      label: "Completed",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig


  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full"> 
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Total" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="Completed" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
        </div>
      </CardFooter>
    </Card>
  )
}
