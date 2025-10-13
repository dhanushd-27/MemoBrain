import { pgTable, integer, varchar } from "drizzle-orm/pg-core"

export const users = pgTable('users', {
  id: integer('id').primaryKey().notNull().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull()
})