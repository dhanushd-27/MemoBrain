import {
  pgTable,
  uuid,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./user";
import { memos } from "./memo";
import { sliceAccess } from "./sliceAccess";

export const slices = pgTable("slices", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  accessStatus: text("access_status").notNull().default("private"), // "private" | "public" | "specific"
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const sliceRelations = relations(slices, ({ one, many }) => ({
  owner: one(users, {
    fields: [slices.ownerId],
    references: [users.id],
  }),
  memos: many(memos),
  accessGrants: many(sliceAccess),
}));
