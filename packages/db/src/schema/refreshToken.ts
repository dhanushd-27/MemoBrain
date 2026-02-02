import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./user.js";

export const refreshTokens = pgTable("refresh_tokens", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`)
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  tokenHash: varchar("token_hash", { length: 256 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at")
    .default(sql`now()`)
    .notNull(),
  revokedAt: timestamp("revoked_at"),
});

export const refreshTokenRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));
