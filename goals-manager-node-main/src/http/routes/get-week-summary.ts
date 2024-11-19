import { getWeekSummary } from '@/app/functions/get-week-summary'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'
import z from 'zod'
import dayjs from 'dayjs'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/summary',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        operationId: 'getWeekSummary',
        description: 'Get week summary',
        querystring: z.object({
          weekStartsAt: z.coerce
            .date()
            .optional()
            .default(dayjs().startOf('week').toDate()),
        }),
      },
    },
    async request => {
      const userId = request.user.sub
      const { weekStartsAt } = request.query

      const { summary } = await getWeekSummary({
        userId,
        weekStartsAt,
      })

      return { summary }
    }
  )
}
