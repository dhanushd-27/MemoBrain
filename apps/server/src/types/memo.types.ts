import type { Memo } from "@repo/types";

// Request types
export interface CreateMemoRequest {
  type: "TEXT" | "TODO" | "LINK" | "QA" | "CODE";
  title?: string;
  content: any; // Will be validated based on type
  sliceId: string;
  pinned?: boolean;
}

export interface UpdateMemoRequest {
  type?: "TEXT" | "TODO" | "LINK" | "QA" | "CODE";
  title?: string;
  content?: any;
  pinned?: boolean;
}

// Response types
export interface MemoResponse {
  memo: Memo;
}

export interface MemosResponse {
  memos: Memo[];
}

export interface DeleteMemoResponse {
  message: string;
}
