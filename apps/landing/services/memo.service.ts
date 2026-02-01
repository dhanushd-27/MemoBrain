import apiClient from "../lib/axios";
import type { Memo } from "@repo/types";

// Types corresponding to backend responses
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

export interface MemoResponse {
  memo: Memo;
}

export interface DeleteMemoResponse {
  message: string;
}

export const createMemo = async (
  data: CreateMemoRequest,
): Promise<MemoResponse> => {
  const response = await apiClient.post<MemoResponse>("/memo", data);
  return response.data;
};

export const getMemo = async (id: string): Promise<MemoResponse> => {
  const response = await apiClient.get<MemoResponse>(`/memo/${id}`);
  return response.data;
};

export const updateMemo = async (
  id: string,
  data: UpdateMemoRequest,
): Promise<MemoResponse> => {
  const response = await apiClient.patch<MemoResponse>(`/memo/${id}`, data);
  return response.data;
};

export const deleteMemo = async (id: string): Promise<DeleteMemoResponse> => {
  const response = await apiClient.delete<DeleteMemoResponse>(`/memo/${id}`);
  return response.data;
};
