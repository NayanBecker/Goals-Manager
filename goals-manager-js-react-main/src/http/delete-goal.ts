import Cookies from 'universal-cookie'

export interface DeleteGoalRequest {
  goalId: string
}

export async function deleteGoal({ goalId }: DeleteGoalRequest): Promise<void> {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')

  const response = await fetch(`http://localhost:3333/delete/${goalId}`, {
    method: 'DELETE',

    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Error while deleting the goal')
  }
}
