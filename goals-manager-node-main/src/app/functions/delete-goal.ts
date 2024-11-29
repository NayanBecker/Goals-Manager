import { db } from '@/db'
import { goals, goalCompletions } from '@/db/schema'
import { eq, and, isNull } from 'drizzle-orm'

export async function deleteGoal({
  goalId,
}: { goalId: string }): Promise<{ success: boolean; error?: string }> {
  // Excluir apenas os registros pendentes relacionados à meta
  await db
    .delete(goalCompletions)
    .where(and(eq(goalCompletions.goalId, goalId)))

  // Verificar se ainda há dependências restantes
  const remainingCompletions = await db
    .select()
    .from(goalCompletions)
    .where(eq(goalCompletions.goalId, goalId))

  if (remainingCompletions.length > 0) {
    return {
      success: false,
      error: 'Goal has completed tasks and cannot be fully deleted.',
    }
  }

  // Excluir a meta
  const result = await db.delete(goals).where(eq(goals.id, goalId)).returning()

  return { success: result.length > 0 }
}
