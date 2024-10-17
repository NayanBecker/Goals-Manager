export interface DailyGoal {
  date: string // Data no formato yyyy-mm-dd
  completed: number // Total de metas completadas no dia
  total: number // Total de metas criadas no dia
}

export interface GetDailyGoalsResponse {
  dailyChart: DailyGoal[] // Array com os dados diários de metas
}

export async function getDailyGoals(): Promise<GetDailyGoalsResponse> {
  const response = await fetch('http://localhost:3333/daily-goals-chart')

  if (!response.ok) {
    throw new Error('Failed to fetch daily goals data')
  }

  const data = await response.json()

  // Validação mínima dos dados recebidos, garantindo que seja um array de `DailyGoal`
  if (!Array.isArray(data.dailyChart)) {
    throw new Error('Invalid response format')
  }

  return {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    dailyChart: data.dailyChart.map((item: any) => ({
      date: String(item.date), // Garante que 'date' seja string
      completed: Number(item.completed), // Garante que 'completed' seja number
      total: Number(item.total), // Garante que 'total' seja number
    })),
  }
}
