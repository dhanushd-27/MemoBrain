import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { 
  users, 
  slices, 
  sliceAccess, 
  memos, 
  refreshTokens 
} from '@repo/db';

// User types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Slice types
export type Slice = InferSelectModel<typeof slices>;
export type NewSlice = InferInsertModel<typeof slices>;

// SliceAccess types
export type SliceAccess = InferSelectModel<typeof sliceAccess>;
export type NewSliceAccess = InferInsertModel<typeof sliceAccess>;

// Memo / Brain types
export type Memo = InferSelectModel<typeof memos>;
export type NewMemo = InferInsertModel<typeof memos>;
export type Brain = Memo;
export type NewBrain = NewMemo;

// RefreshToken types
export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;

// Content type enum
export type ContentType = "text" | "url" | "image" | "video" | "file";

// SliceAccess role enum
export type SliceAccessRole = "viewer" | "editor";
