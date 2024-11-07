import { getDailyGoalsChart } from '@/app/functions/get-daily-goals-data'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'

export const getDailyGoalsChartRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/daily-goals-chart',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        operationId: 'getDailyGoalsChart',
        description: 'Daily Chart',
      },
    },
    async () => {
      const { dailyChart } = await getDailyGoalsChart()

      return { dailyChart }
    }
  )
}
