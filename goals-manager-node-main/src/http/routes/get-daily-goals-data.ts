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
    async (request, reply) => {
      try {
        const userId = request.user.sub
        const { dailyChart } = await getDailyGoalsChart({ userId })
        return reply.send({ dailyChart })
      } catch (error) {
        console.error('Erro ao buscar metas diárias:', error)
        return reply.status(500).send({ error: 'Erro interno do servidor' })
      }
    }
  )
}
