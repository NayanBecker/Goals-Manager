import { createGoalCompletion } from '@/app/functions/create-goal-completion'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { authenticatedUserHook } from '../hooks/authenticate-user'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/completions',
    {
      onRequest: [authenticatedUserHook],
      schema: {
        tags: ['goals'],
        description: 'complete a Goal',
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { goalId } = request.body
      const userId = request.user.sub

      await createGoalCompletion({
        goalId,
        userId,
      })

      return reply.status(201).send()
    }
  )
}
