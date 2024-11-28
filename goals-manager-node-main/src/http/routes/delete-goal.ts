import { deleteGoal } from '@/app/functions/delete-goal'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'

export const deleteGoalRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/delete/:goalId',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        description: 'Delete a goal by its ID',
        operationId: 'deleteGoal',
        params: z.object({
          goalId: z.string(),
        }),
        response: {
          200: z.null(),
          404: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { goalId } = request.params
      const userId = request.user.sub

      // Chamar a função de exclusão
      const result = await deleteGoal({ goalId })

      if (!result.success) {
        return reply.status(404).send({
          message: 'Goal not found or you do not have permission to delete it.',
        })
      }

      return reply.status(200).send()
    }
  )
}
