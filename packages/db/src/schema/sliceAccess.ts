import { pgTable, uuid, text, primaryKey } from "drizzle-orm/pg-core"
import { relations, sql } from "drizzle-orm"
import { users } from "./user"
import { slices } from "./slice"

export const sliceAccess = pgTable('slice_access', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey().notNull(),
  sliceId: uuid('slice_id').references(() => slices.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  role: text('role').notNull(), // "viewer" | "editor"
})

export const sliceAccessRelations = relations(sliceAccess, ({ one }) => (
  {
    slice: one(slices, {
      fields: [sliceAccess.sliceId],
      references: [slices.id],
    }),
    user: one(users, {
      fields: [sliceAccess.userId],
      references: [users.id],
    })
  }
))
