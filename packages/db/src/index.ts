import { drizzle } from "drizzle-orm/node-postgres";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import * as schema from "./schema/index.js";

const db = drizzle(process.env.DATABASE_URL as string, { schema });

export { db, schema };
export * from "./schema/index.js";

// Explicit exports for better TypeScript resolution
export { users, userRelations } from "./schema/user.js";
export { slices, sliceRelations } from "./schema/slice.js";
export { sliceAccess, sliceAccessRelations } from "./schema/sliceAccess.js";
export { memos, memoRelations, memoTypeEnum } from "./schema/memo.js";
export { refreshTokens, refreshTokenRelations } from "./schema/refreshToken.js";
export * from "./types.js";

// Export inferred types
export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Slice = InferSelectModel<typeof schema.slices>;
export type NewSlice = InferInsertModel<typeof schema.slices>;

export type SliceAccess = InferSelectModel<typeof schema.sliceAccess>;
export type NewSliceAccess = InferInsertModel<typeof schema.sliceAccess>;

export type DbMemo = InferSelectModel<typeof schema.memos>;
export type NewMemo = InferInsertModel<typeof schema.memos>;

export type RefreshToken = InferSelectModel<typeof schema.refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof schema.refreshTokens>;
