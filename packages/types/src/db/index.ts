import {
  users,
  slices,
  sliceAccess,
  memos,
  refreshTokens,
  type User,
  type NewUser,
  type Slice,
  type NewSlice,
  type SliceAccess,
  type NewSliceAccess,
  type DbMemo,
  type NewMemo,
  type RefreshToken,
  type NewRefreshToken,
} from "@repo/db";
import type {
  TextContent,
  TodoContent,
  LinkContent,
  QAContent,
  CodeContent,
} from "../common/content";

// User types
export type { User };
export type { NewUser };

// Slice types
export type { Slice };
export type { NewSlice };

// SliceAccess types
export type { SliceAccess };
export type { NewSliceAccess };

// Memo types
export type { DbMemo };
export type { NewMemo };

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
export type { RefreshToken };
export type { NewRefreshToken };

// Memo type enum
export type MemoType = "TEXT" | "TODO" | "LINK" | "QA" | "CODE";

// SliceAccess role enum
export type SliceAccessRole = "viewer" | "editor";
