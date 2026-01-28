import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, slices, sliceAccess, memos, refreshTokens } from "@repo/db";

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Slice types
export type Slice = InferSelectModel<typeof slices>;
export type NewSlice = InferInsertModel<typeof slices>;

// SliceAccess types
export type SliceAccess = InferSelectModel<typeof sliceAccess>;
export type NewSliceAccess = InferInsertModel<typeof sliceAccess>;

// Memo types
export type Memo = InferSelectModel<typeof memos>;
export type NewMemo = InferInsertModel<typeof memos>;

// RefreshToken types
export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;

// Memo type enum
export type MemoType = "TEXT" | "TODO" | "LINK" | "QA" | "CODE";

// SliceAccess role enum
export type SliceAccessRole = "viewer" | "editor";

// HTTP Status Codes
export * from "./http-status";

// Validation Schemas
export * from "./validation";

export * from "./memo.type";
