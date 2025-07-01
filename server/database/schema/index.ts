import { pgTable, text, timestamp, boolean, bigint } from 'drizzle-orm/pg-core'

import { user, organization } from './auth'

export * from './auth'

export const notes = pgTable('notes', {
  id: bigint({ mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  done: boolean('done').notNull().default(false),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})
