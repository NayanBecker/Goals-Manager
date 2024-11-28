import { getWeekPendingGoals } from '@/app/functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'
import z from 'zod'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        description: 'Get pending goals',
        operationId: 'getPendingGoals',
        response: {
          200: z.object({
            pendingGoals: z.array(
              z.object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number(),
                completionCount: z.number(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        console.log('User autenticado:', request.user)

        const userId = request.user.sub
        if (!userId) {
          throw new Error('User ID não encontrado no token')
        }

        const { pendingGoals } = await getWeekPendingGoals({ userId })
        console.log('Pending Goals:', pendingGoals)

        return reply.send({ pendingGoals })
      } catch (error) {
        console.error('Erro na rota /pending-goals')
        return reply.status(500)
      }
    }
  )
}
