import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { DailyGoalsProps } from "@/interfaces/dailychard";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import dayjs from "dayjs";
import { filterGoalsByWeek, formatWeekRange, getWeekRange } from "./ui/filterByWeek";
import { Button } from "./ui/button";
import { useState } from "react";


export const description = "A multiple bar chart";


interface DailyGoalsComponentProps {
  dailyChart: DailyGoalsProps[]; 
}

export function DailyGoals({ dailyChart }: DailyGoalsComponentProps) {
  const [weekOffset, setWeekOffset] = useState(0); 
  const { startOfWeek, endOfWeek } = getWeekRange(weekOffset);
  const formattedWeekRange = formatWeekRange(startOfWeek, endOfWeek);


  const filteredData = filterGoalsByWeek(dailyChart, startOfWeek, endOfWeek);
  
  const mappedData = filteredData.map((item) => ({
    day: dayjs(item.date).format("dddd"), 
    Total: item.total, // Total de metas criadas
    Completed: item.completed, // Total de metas completadas
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
  } satisfies ChartConfig;

  
  return (
    
    <Card className="bg-ring backdrop-brightness-50 bg-opacity-35">
      <CardHeader>
        <CardTitle className="text-white">Metas da Semana</CardTitle>
        <CardDescription><span>{formattedWeekRange}</span></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full ">
          <BarChart data={mappedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)} // Capitaliza o nome do dia
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Total" fill={chartConfig.Total.color} radius={4} />
            <Bar dataKey="Completed" fill={chartConfig.Completed.color} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-row items-center justify-between gap-2 text-sm ">
        <Button onClick={() => setWeekOffset(weekOffset - 1)}>Semana Anterior</Button>
        <Button onClick={() => setWeekOffset(weekOffset + 1)}>Próxima Semana</Button>
      </CardFooter>
    </Card>
  );
}

