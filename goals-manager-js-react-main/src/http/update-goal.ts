import Cookies from 'universal-cookie'

export interface UpdateGoalRequest {
  goalId: string
  title?: string
  desiredWeeklyFrequency?: number
}

export async function updateGoal({
  goalId,
  title,
  desiredWeeklyFrequency,
}: UpdateGoalRequest): Promise<void> {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const body: Record<string, any> = {}
  if (title) body.title = title
  if (desiredWeeklyFrequency)
    body.desiredWeeklyFrequency = desiredWeeklyFrequency

  if (Object.keys(body).length === 0) {
    throw new Error('No fields provided to update the goal')
  }

  const response = await fetch(`http://localhost:3333/update/${goalId}`, {
    method: 'PATCH',

    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Error while updating the goal')
  }
}
