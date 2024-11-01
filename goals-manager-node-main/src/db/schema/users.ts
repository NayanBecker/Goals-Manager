import { text, timestamp } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name'),
  email: text('email'),
  avatarUrl: text('avatar_url').notNull(),
  externalAccountID: integer('external_account_id').notNull().unique(),
})
