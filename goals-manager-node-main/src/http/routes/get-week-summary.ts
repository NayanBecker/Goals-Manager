import { getWeekSummary } from '@/app/functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        description: 'Daily Chart',
      },
    },
    async request => {
      const userId = request.user.sub
      const { summary } = await getWeekSummary({
        userId,
      })

      return { summary }
    }
  )
}
