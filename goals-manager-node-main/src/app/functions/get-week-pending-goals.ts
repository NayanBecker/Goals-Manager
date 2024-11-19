import { db } from '@/db'
import { goalCompletions, goals } from '@/db/schema'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, asc, count, eq, gte, lte, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

interface GetWeekPendingGoalsRequest {
  userId: string
}

export async function getWeekPendingGoals({
  userId,
}: GetWeekPendingGoalsRequest) {
  const firstDayOfWeek = dayjs().startOf('week').toDate()
  const lastDayOfWeek = dayjs().endOf('week').toDate()

  console.log('User ID:', userId)
  console.log('Período da semana:', firstDayOfWeek, lastDayOfWeek)

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          gte(goals.createdAt, firstDayOfWeek),
          lte(goals.createdAt, lastDayOfWeek),
          eq(goals.userId, userId)
        )
      )
  )
  console.log('Goals created up to week:', goalsCreatedUpToWeek)

  const goalCompletionCounts = db.$with('goal_completion_counts').as(
    db
      .select({
        goalId: goals.id,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goals.userId, userId)
        )
      )
      .groupBy(goals.id)
  )
  console.log('Goal completion counts:', goalCompletionCounts)

  const pendingGoals = await db
    .with(goalsCreatedUpToWeek, goalCompletionCounts)
    .select({
      id: goalsCreatedUpToWeek.id,
      title: goalsCreatedUpToWeek.title,
      desiredWeeklyFrequency: goalsCreatedUpToWeek.desiredWeeklyFrequency,
      completionCount: sql /*sql*/`
        COALESCE(${goalCompletionCounts.completionCount}, 0)`.mapWith(Number),
    })
    .from(goalsCreatedUpToWeek)
    .leftJoin(
      goalCompletionCounts,
      eq(goalCompletionCounts.goalId, goalsCreatedUpToWeek.id)
    )
  console.log('Pending Goals Final:', pendingGoals)

  return { pendingGoals }
}
