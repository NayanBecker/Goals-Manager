import Cookies from 'universal-cookie'

export interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest): Promise<void> {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')

  const response = await fetch('http://localhost:3333/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      goalId,
    }),
  })

  if (!response.ok) {
    throw new Error('Error while creating the goal completion')
  }
}
