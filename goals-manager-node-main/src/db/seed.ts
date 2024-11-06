import { client, db } from '@/db'
import { goals, users, goalCompletions } from './schema'
import { fakerPT_BR as faker } from '@faker-js/faker'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const [user] = await db
    .insert(users)
    .values({
      name: 'Nayas',
      externalAccountID: 12312354,
      avatarUrl: 'https://github.com/nayanbecker.png',
    })
    .returning()

  const result = await db
    .insert(goals)
    .values([
      {
        userId: user.id,
        title: 'Acordar Cedo',
        desiredWeeklyFrequency: 1,
      },
      {
        userId: user.id,
        title: 'Arrumar mala',
        desiredWeeklyFrequency: 1,
      },
      {
        userId: user.id,
        title: 'Limpar meu Quarto',
        desiredWeeklyFrequency: 2,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
})
