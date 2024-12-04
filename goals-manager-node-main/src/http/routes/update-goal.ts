import { updateGoal } from '@/app/functions/update-goal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'

export const updateGoalRoute: FastifyPluginAsyncZod = async app => {
  app.patch(
    '/update/:goalId',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        description: 'Update a goal',
        operationId: 'updateGoal',
        params: z.object({
          goalId: z.string(),
        }),
        body: z.object({
          title: z.string().optional(),
          desiredWeeklyFrequency: z.number().int().min(1).max(7).optional(),
        }),
        response: {
          200: z.object({
            success: z.boolean(),
            updatedGoal: z
              .object({
                id: z.string(),
                title: z.string(),
                desiredWeeklyFrequency: z.number(),
                createdAt: z.date(),
              })
              .optional(),
            error: z.string().optional(),
          }),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { goalId } = request.params
      const { title, desiredWeeklyFrequency } = request.body

      const result = await updateGoal({
        goalId,
        title,
        desiredWeeklyFrequency,
      })

      if (!result.success) {
        const status = result.error === 'Goal not found' ? 404 : 400
        return reply.status(status).send({
          message: result.error || 'Failed to update goal.',
        })
      }

      return reply.status(200).send(result)
    }
  )
}
