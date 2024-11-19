import type { FastifyRequest, FastifyReply } from 'fastify'
import {} from '@/app/modules/auth'
import { decodeJwt, jwtVerify } from 'jose'
import { env } from '@/env'

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    const token = authHeader?.split(' ')[1]

    if (!token) {
      throw new Error('No token provided')
    }

    const secret = new TextEncoder().encode(env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    if (!payload.sub) {
      throw new Error('Invalid token payload')
    }
    request.user = { sub: payload.sub }
  } catch (error) {
    reply.status(401).send({ message: 'Unauthorized' })
  }
}
