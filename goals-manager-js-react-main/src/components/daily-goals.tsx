import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { DailyGoalsProps } from "@/interfaces/dailychard"; // Mantém o nome da interface importada

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
import dayjs from "dayjs"; // Importa a biblioteca para manipular as datas

export const description = "A multiple bar chart";

// Renomeia a interface local para evitar conflito
interface DailyGoalsComponentProps {
  dailyChart: DailyGoalsProps[]; // Usa a interface importada para tipar o array de dados
}

export function DailyGoals({ dailyChart }: DailyGoalsComponentProps) {
  // Mapeando dailyChart para o formato esperado pelo Recharts
  const mappedData = dailyChart.map((item) => ({
    day: dayjs(item.date).format("dddd"), // Formata a data como o nome do dia da semana
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
    
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Weekly Goals</CardTitle>
        <CardDescription>My Week's Goals</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={mappedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day" // Exibe o nome do dia da semana (segunda, terça, etc.)
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
            <Bar
              dataKey="Completed"
              fill={chartConfig.Completed.color}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {/* Footer opcional, removido para manter o código mais limpo */}
      </CardFooter>
    </Card>
  );
}
