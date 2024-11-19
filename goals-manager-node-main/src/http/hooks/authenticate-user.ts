import type { FastifyReply, FastifyRequest } from 'fastify'

export async function authenticatedUserHook(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
    console.log('Decoded user:', request.user)
    console.log('Authorization header:', request.headers.authorization)
    console.log('Decoded user:', request.user)
  } catch {
    return reply.status(401).send({ message: 'Unauthorized' })
  }
}
