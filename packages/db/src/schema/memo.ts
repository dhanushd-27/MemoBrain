import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { slices } from "./slice.js";
import { users } from "./user.js";
import type { MemoContent } from "../types.js";

// Define the memo type enum
export const memoTypeEnum = pgEnum("memo_type", [
  "TEXT",
  "TODO",
  "LINK",
  "QA",
  "CODE",
]);

export const memos = pgTable("memos", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  sliceId: uuid("slice_id")
    .references(() => slices.id)
    .notNull(),

  type: memoTypeEnum("type").notNull(),

  title: text("title"), // optional but recommended
  content: jsonb("content").$type<MemoContent>().notNull(), // type-specific payload

  pinned: boolean("pinned").default(false).notNull(), // ⭐ pin / highlight

  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`now()`)
    .notNull(),
});

export const memoRelations = relations(memos, ({ one }) => ({
  slice: one(slices, {
    fields: [memos.sliceId],
    references: [slices.id],
  }),
  user: one(users, {
    fields: [memos.userId],
    references: [users.id],
  }),
}));
