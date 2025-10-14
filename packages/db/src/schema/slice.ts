import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { users } from "./user"
import { memos } from "./memo"

export const slices = pgTable('slices', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  authorId: uuid('author_id').references(() => users.id).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
})

export const userSlices = relations(slices, ({ one }) => (
  {
    author: one(users, {
      fields: [slices.authorId],
      references: [users.id],
    })
  }
))

export const sliceMemos = relations(slices, ({ many }) => (
  {
    memos: many(memos),
  }
))