import apiClient from "../lib/axios";
import type { Slice, Memo } from "@repo/types";

// Types corresponding to backend responses
export interface CreateSliceRequest {
  name: string;
  description: string;
}

export interface SliceResponse {
  slice: Slice;
}

export interface SlicesResponse {
  slices: Slice[];
}

export interface SliceBrainsResponse {
  sliceId: string;
  brains: Memo[];
}

export const createSlice = async (
  data: CreateSliceRequest,
): Promise<SliceResponse> => {
  const response = await apiClient.post<SliceResponse>("/slice", data);
  return response.data;
};

export const getSlices = async (title?: string): Promise<SlicesResponse> => {
  const params = title ? { title } : {};
  const response = await apiClient.get<SlicesResponse>("/slice", { params });
  return response.data;
};

export const getSlice = async (sliceId: string): Promise<SliceResponse> => {
  const response = await apiClient.get<SliceResponse>(`/slice/${sliceId}`);
  return response.data;
};

export const getSliceBrains = async (
  sliceId: string,
): Promise<SliceBrainsResponse> => {
  const response = await apiClient.get<SliceBrainsResponse>(
    `/slice/${sliceId}/brains`,
  );
  return response.data;
};
