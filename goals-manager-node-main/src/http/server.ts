import fastify from 'fastify'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastifySwagger } from '@fastify/swagger'
import { createGoalRoute } from './routes/create-goal'
import { createGoalCompletionRoute } from './routes/create-goal-completion'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { getWeekPendingGoalsRoute } from './routes/get-week-pending-goals'
import { getDailyGoalsChartRoute } from './routes/get-daily-goals-data'
import { deleteGoalRoute } from './routes/delete-goal'
import { authenticateFromGithubRoute } from './routes/authenticate-github-user'
import { env } from '@/env'
import { getProfileRoute } from './routes/get-profile'
import { resolve } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { updateGoalRoute } from './routes/update-goal'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, { origin: '*' })

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Goals Manager',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(getWeekSummaryRoute)
app.register(getWeekPendingGoalsRoute)
app.register(getDailyGoalsChartRoute)
app.register(deleteGoalRoute)
app.register(authenticateFromGithubRoute)
app.register(getProfileRoute)
app.register(updateGoalRoute)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server running!')
})

if (env.NODE_ENV === 'development') {
  const specFile = resolve(__dirname, '../../swagger.json')

  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 4)

    writeFile(specFile, spec).then(() => {
      console.log('Swagger spec was generated!')
    })
  })
}
