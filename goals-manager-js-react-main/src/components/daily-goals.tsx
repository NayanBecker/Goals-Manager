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
import {
  filterGoalsByWeek,
  formatWeekRange,
  getWeekRange,
} from "./ui/filterByWeek";
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

  const weekData = Array.from({ length: 7 }, (_, i) => {
    const day = startOfWeek.add(i, "day");
    return {
      day: day.format("dddd"),
      Total: 0,
      Completed: 0,
    };
  });

  const filteredData = filterGoalsByWeek(dailyChart, startOfWeek, endOfWeek);

  const mappedData = weekData.map((baseDay) => {
    const match = filteredData.find(
      (item) => dayjs(item.date).format("dddd") === baseDay.day
    );
    return {
      ...baseDay,
      Total: match?.total || 0,
      Completed: match?.completed || 0,
    };
  });

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
        <CardDescription>
          <span>{formattedWeekRange}</span>
        </CardDescription>
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
              tickFormatter={(value) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              } // Capitaliza o nome do dia
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="Total" fill={chartConfig.Total.color} radius={4} />
            <Bar
              dataKey="Completed"
              fill={chartConfig.Completed.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-row items-center justify-between gap-2 text-sm ">
        <Button onClick={() => setWeekOffset(weekOffset - 1)}>
          Semana Anterior
        </Button>
        <Button onClick={() => setWeekOffset(weekOffset + 1)}>
          Próxima Semana
        </Button>
      </CardFooter>
    </Card>
  );
}
