import { db } from '@/db/index'
import { goals } from '@/db/schema/goals'
import { eq } from 'drizzle-orm'

interface UpdateGoalRequest {
  goalId: string
  title?: string
  desiredWeeklyFrequency?: number
}

type Goal = {
  id: string
  title: string
  desiredWeeklyFrequency: number
  createdAt: Date
}

export async function updateGoal({
  goalId,
  title,
  desiredWeeklyFrequency,
}: UpdateGoalRequest): Promise<{
  success: boolean
  updatedGoal?: Goal
  error?: string
}> {
  try {
    // Verifica se a meta existe
    const [existingGoal] = await db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(eq(goals.id, goalId))
      .limit(1)

    if (!existingGoal) {
      return { success: false, error: 'Goal not found' }
    }
    // Atualiza os campos fornecidos dinamicamente
    const updatedFields: Partial<Goal> = {}
    if (title !== undefined) updatedFields.title = title
    if (desiredWeeklyFrequency !== undefined)
      updatedFields.desiredWeeklyFrequency = desiredWeeklyFrequency

    const [updatedGoal] = await db
      .update(goals)
      .set(updatedFields)
      .where(eq(goals.id, goalId))
      .returning({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })

    if (!updatedGoal) {
      return { success: false, error: 'Failed to update goal' }
    }

    return {
      success: true,
      updatedGoal,
    }
  } catch (error) {
    console.error('Error updating goal:', error)
    return {
      success: false,
      error: 'An error occurred while updating the goal',
    }
  }
}
