import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

export function useDrizzle() {
  return drizzle({
    connection: {
      connectionString: process.env.DATABASE_URL
    },
    schema
  })
}

export const tables = schema

export type Note = typeof schema.notes.$inferSelect
export type User = typeof schema.user.$inferSelect
export type Organization = typeof schema.organization.$inferSelect
