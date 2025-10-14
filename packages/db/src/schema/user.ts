import { pgTable, varchar, uuid, timestamp, index } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { slices } from "./slice"

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`).notNull(),
  firstName: varchar("first_name", { length: 256 }).notNull(),
  lastName: varchar("last_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  password: varchar("password", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
  refreshToken: varchar("refresh_token", { length: 256 }).notNull(),
})

export const userSlices = relations(users, ({ many }) => (
  {
    slices: many(slices),
  }
))