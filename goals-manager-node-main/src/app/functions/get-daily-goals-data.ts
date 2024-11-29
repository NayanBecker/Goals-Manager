import { db } from '@/db'
import { goalCompletions, goals } from '@/db/schema'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-BR'

import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, asc, count, sql } from 'drizzle-orm'

dayjs.extend(weekOfYear)

interface GetDailyGoalsChartRequest {
  userId: string
}

export async function getDailyGoalsChart({
  userId,
}: GetDailyGoalsChartRequest) {
  try {
    // const currentYear = dayjs().year()
    // const currentWeek = dayjs().week()

    // // Seleção de metas criadas até a semana atual
    // const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
    //   db
    //     .select({
    //       id: goals.id,
    //       desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
    //       createdAt: goals.createdAt,
    //     })
    //     .from(goals)
    //     .where(
    //       and(
    //         sql`EXTRACT(YEAR FROM ${goals.createdAt}) <= ${currentYear}`,
    //         sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`,
    //       ),
    //     ),
    // );

    // // Seleção de metas completadas na semana atual
    // const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
    //   db
    //     .select({
    //       id: goalCompletions.id,
    //       completionDate: sql`DATE(${goalCompletions.createdAt})`.as("completionDate"),
    //     })
    //     .from(goalCompletions)
    //     .innerJoin(goals, sql`${goals.id} = ${goalCompletions.goalId}`)
    //     .where(
    //       and(
    //         sql`EXTRACT(YEAR FROM ${goalCompletions.createdAt}) = ${currentYear}`,
    //         sql`EXTRACT(WEEK FROM ${goalCompletions.createdAt}) = ${currentWeek}`,
    //       ),
    //     )
    //     .orderBy(asc(goalCompletions.createdAt)),
    // );

    // Seleção de metas completadas por dia
    const dailyGoalsChart = db.$with('goals_by_day').as(
      db
        .select({
          completionDate: sql`DATE(${goalCompletions.createdAt})`.as(
            'completionDate'
          ), // Data da conclusão
          completed: count().as('completed'), // Total de metas concluídas no dia
        })
        .from(goalCompletions)
        .innerJoin(goals, sql`${goals.id} = ${goalCompletions.goalId}`) // Realizando o join com a tabela goals
        .where(sql`${goals.userId} = ${userId}`) // Aplicando o filtro pelo userId da tabela goals
        .groupBy(sql`DATE(${goalCompletions.createdAt})`)
    )

    // Seleção de metas criadas por dia
    const goalsCreatedPerDay = db.$with('goals_created_by_day').as(
      db
        .select({
          creationDate: sql`DATE(${goals.createdAt})`.as('creationDate'), // Data da criação
          total: count().as('total'), // Total de metas criadas no dia
        })
        .from(goals)
        .where(sql`${goals.userId} = ${userId}`)
        .groupBy(sql`DATE(${goals.createdAt})`) // Agrupando por dia da criação
    )

    // Seleção final combinando metas criadas e completadas
    const dailyChart = await db
      .with(dailyGoalsChart, goalsCreatedPerDay)
      .select({
        date: sql`DATE(${dailyGoalsChart.completionDate})::text`.as('date'), // Retorna a data como string
        completed: dailyGoalsChart.completed, // Total de metas concluídas
        total: sql`COALESCE(${goalsCreatedPerDay.total}, 0)`.as('total'), // Total de metas criadas (se não houver, retorna 0)
      })
      .from(dailyGoalsChart)
      .leftJoin(
        goalsCreatedPerDay,
        sql`DATE(${goalsCreatedPerDay.creationDate}) = DATE(${dailyGoalsChart.completionDate})`
      ) // Fazendo join das metas criadas e completadas no mesmo dia
      .orderBy(asc(dailyGoalsChart.completionDate)) // Ordenar pela data

    // Log para depuração
    console.log('Dados do gráfico diário:', dailyChart)

    return { dailyChart }
  } catch (error) {
    console.error('Erro ao buscar gráfico diário:', error)
    throw new Error('Erro ao buscar metas diárias.')
  }
}
