import { getWeekPendingGoals } from '@/app/functions/get-week-pending-goals'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/pending-goals',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        operationId: 'getWeekPendingGoals',
        description: 'Daily Chart',
      },
    },
    async request => {
      const userId = request.user.sub
      const { pendingGoals } = await getWeekPendingGoals({ userId })

      return { pendingGoals }
    }
  )
}
