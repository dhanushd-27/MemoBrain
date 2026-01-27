import { pgTable, uuid, text, timestamp, primaryKey } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { slices } from "./slice"
import { users } from "./user"

export const memos = pgTable('memos', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  contentType: text('content_type').notNull(), // "text" | "url" | "image" | "video" | "file"
  content: text('content').notNull(),
  ownerId: uuid('owner_id').references(() => users.id).notNull(),
  sliceId: uuid('slice_id').references(() => slices.id).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
})

export const memoRelations = relations(memos, ({ one }) => (
  {
    slice: one(slices, {
      fields: [memos.sliceId],
      references: [slices.id],
    }),
    owner: one(users, {
      fields: [memos.ownerId],
      references: [users.id],
    })
  }
))