import { db } from '@/db'
import { goalCompletions, goals } from '@/db/schema'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { eq, sql, and } from 'drizzle-orm'

dayjs.extend(weekOfYear)

interface CreateGoalCompletionRequest {
  goalId: string
  userId: string
}

export async function createGoalCompletion({
  userId,
  goalId,
}: CreateGoalCompletionRequest) {
  const currentYear = dayjs().year()
  const currentWeek = dayjs().week()

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: sql`COUNT(${goalCompletions.id})`.as(
          'completionCount'
        ),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          eq(goalCompletions.goalId, goalId),
          sql`EXTRACT(YEAR FROM ${goalCompletions.createdAt}) = ${currentYear}`,
          sql`EXTRACT(WEEK FROM ${goalCompletions.createdAt}) = ${currentWeek}`,
          eq(goals.userId, userId)
        )
      )
      .groupBy(goalCompletions.goalId)
  )

  const result = await db
    .with(goalCompletionCounts)
    .select({
      isIncomplete: sql /*sql*/`
        COALESCE(${goals.desiredWeeklyFrequency}, 0) > COALESCE(${goalCompletionCounts.completionCount}, 0)
      `,
    })
    .from(goals)
    .leftJoin(goalCompletionCounts, eq(goals.id, goalCompletionCounts.goalId))
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .limit(1)

  const { isIncomplete } = result[0]

  if (!isIncomplete) {
    throw new Error('Goal already completed this week!')
  }

  const [goalCompletion] = await db
    .insert(goalCompletions)
    .values({
      goalId,
    })
    .returning()

  return {
    goalCompletion,
  }
}
