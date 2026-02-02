import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { users, slices, sliceAccess, memos, refreshTokens } from "@repo/db";
import type {
  TextContent,
  TodoContent,
  LinkContent,
  QAContent,
  CodeContent,
} from "../common/content";

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
export type DbMemo = InferSelectModel<typeof memos>;
export type NewMemo = InferInsertModel<typeof memos>;

export type Memo =
  | (Omit<DbMemo, "type" | "content"> & {
      type: "TEXT";
      content: TextContent;
    })
  | (Omit<DbMemo, "type" | "content"> & {
      type: "TODO";
      content: TodoContent;
    })
  | (Omit<DbMemo, "type" | "content"> & {
      type: "LINK";
      content: LinkContent;
    })
  | (Omit<DbMemo, "type" | "content"> & { type: "QA"; content: QAContent })
  | (Omit<DbMemo, "type" | "content"> & {
      type: "CODE";
      content: CodeContent;
    });

// RefreshToken types
export type RefreshToken = InferSelectModel<typeof refreshTokens>;
export type NewRefreshToken = InferInsertModel<typeof refreshTokens>;

// Memo type enum
export type MemoType = "TEXT" | "TODO" | "LINK" | "QA" | "CODE";

// SliceAccess role enum
export type SliceAccessRole = "viewer" | "editor";
