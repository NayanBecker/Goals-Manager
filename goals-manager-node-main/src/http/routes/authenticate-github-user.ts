import { authenticateFromGitHub } from '@/app/functions/authenticate-from-github'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const authenticateFromGithubRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/auth/github',
    {
      schema: {
        tags: ['auth'],
        operationId: 'authenticateFromGithub',
        description: 'Authenticate user from Github code',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({ token: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const { token } = await authenticateFromGitHub({
        code,
      })

      return reply.status(201).send({ token })
    }
  )
}
