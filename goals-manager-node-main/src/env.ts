import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  GITHUB_CLIENT_ID: z.string(),
  GITHUB_SECRET_ID: z.string(),
  JWT_SECRET: z.string(),
  NODE_ENV: z.string(),
})

export const env = envSchema.parse(process.env)
