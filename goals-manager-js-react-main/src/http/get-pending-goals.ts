import Cookies from 'universal-cookie'

export interface GetPendingGoalsResponse {
  pendingGoals: {
    id: string
    title: string
    desiredWeeklyFrequency: number
    completionCount: number
  }[]
}

export async function getPendingGoals(): Promise<GetPendingGoalsResponse> {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')

  console.log('Token enviado:', token)

  const response = await fetch('http://localhost:3333/pending-goals', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    console.error('Erro ao buscar pending goals:', errorMessage)
    throw new Error('Error fetching summary data')
  }

  const data = await response.json()
  return data
}
