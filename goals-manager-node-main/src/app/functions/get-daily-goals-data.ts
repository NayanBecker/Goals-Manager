import { db } from "@/db";
import { goalCompletions, goals } from "@/db/schema";
import dayjs from "dayjs";
import 'dayjs/locale/pt-BR'

import weekOfYear from "dayjs/plugin/weekOfYear";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

dayjs.extend(weekOfYear);

export async function getDailyGoalsChart() {
	const currentYear = dayjs().year();
	const currentWeek = dayjs().week();

	const goalsCreatedUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				createdAt: goals.createdAt,
			})
			.from(goals)
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${goals.createdAt}) <= ${currentYear}`,
					sql`EXTRACT(WEEK FROM ${goals.createdAt}) <= ${currentWeek}`,
				),
			),
	);

	const goalsCompletedInWeek = db.$with("goals_completed_in_week").as(
		db
			.select({
				id: goalCompletions.id,
				completionDate: sql`DATE(${goalCompletions.createdAt})`.as("completionDate"),
			})
			.from(goalCompletions)
			.innerJoin(goals, eq(goals.id, goalCompletions.goalId))
			.where(
				and(
					sql`EXTRACT(YEAR FROM ${goalCompletions.createdAt}) = ${currentYear}`,
					sql`EXTRACT(WEEK FROM ${goalCompletions.createdAt}) = ${currentWeek}`,
				),
			).orderBy(asc(goalCompletions.createdAt)),
	);


	const dailyGoalsChart = db.$with("goals_by_day").as(
		db
		  .select({
			completionDate: sql`DATE(${goalCompletions.createdAt})`.as("completionDate"), // Data da conclusão
			completed: count().as("completed"), // Total de metas concluídas no dia
		  })
		  .from(goalCompletions)
		  .groupBy(sql`DATE(${goalCompletions.createdAt})`) // Agrupando por dia da conclusão
	  );
	  
	  const goalsCreatedPerDay = db.$with("goals_created_by_day").as(
		db
		  .select({
			creationDate: sql`DATE(${goals.createdAt})`.as("creationDate"), // Data da criação
			total: count().as("total"), // Total de metas criadas no dia
		  })
		  .from(goals)
		  .groupBy(sql`DATE(${goals.createdAt})`) // Agrupando por dia da criação
	  );
	  
	  const dailyChart = await db
		.with(dailyGoalsChart, goalsCreatedPerDay)
		.select({
		  date: dailyGoalsChart.completionDate,
		  completed: dailyGoalsChart.completed,
		  total: sql`COALESCE(${goalsCreatedPerDay.total}, 0)`.as("total"), // Metas criadas nesse dia (se não houver, retorna 0)
		})
		.from(dailyGoalsChart)
		.leftJoin(goalsCreatedPerDay, sql`DATE(${goalsCreatedPerDay.creationDate}) = DATE(${dailyGoalsChart.completionDate})`) // Fazendo join das metas criadas e completadas no mesmo dia
		.orderBy(asc(dailyGoalsChart.completionDate)); // Ordenar pela data
	  
	  console.log(dailyChart);
	  
	  return {
		dailyChart,
	  };
}
