import Cookies from 'universal-cookie'

export interface DailyGoal {
  date: string
  completed: number
  total: number
}

export interface GetDailyGoalsResponse {
  dailyChart: DailyGoal[]
}

export async function getDailyGoals(): Promise<GetDailyGoalsResponse> {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')

  const response = await fetch('http://localhost:3333/daily-goals-chart', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch daily goals data')
  }

  const data = await response.json()

  if (!Array.isArray(data.dailyChart)) {
    throw new Error('Invalid response format')
  }

  return {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    dailyChart: data.dailyChart.map((item: any) => ({
      date: String(item.date),
      completed: Number(item.completed),
      total: Number(item.total),
    })),
  }
}
