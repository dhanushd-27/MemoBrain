import { pgTable, varchar, uuid, timestamp, index } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { slices } from "./slice";

export const users = pgTable("users", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  googleId: varchar("google_id", { length: 256 }).unique(),
  passwordHash: varchar("password_hash", { length: 256 }),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  slices: many(slices),
}));
