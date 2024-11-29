import Cookies from 'universal-cookie'
export interface GetSummaryResponse {
  summary: {
    completed: number
    total: number
    goalsPerDay: Record<
      string,
      {
        id: string
        title: string
        completedAt: string
      }[]
    >
  }
}

export async function getSummary(): Promise<GetSummaryResponse> {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')
  console.log('Token enviado para o backend:', token)

  const response = await fetch('http://localhost:3333/summary', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error fetching summary data')
  }

  const data = await response.json()
  return data
}
