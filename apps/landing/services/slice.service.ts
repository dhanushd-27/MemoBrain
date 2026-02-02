import apiClient from "../lib/axios";
import type { Slice, Memo } from "@repo/types";

// Types corresponding to backend responses
export interface CreateSliceRequest {
  name: string;
  description: string;
}

export interface UpdateSliceRequest {
  name?: string;
  description?: string;
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

export const updateSlice = async (
  sliceId: string,
  data: UpdateSliceRequest,
): Promise<SliceResponse> => {
  const response = await apiClient.patch<SliceResponse>(
    `/slice/${sliceId}`,
    data,
  );
  return response.data;
};

export const deleteSlice = async (sliceId: string): Promise<void> => {
  await apiClient.delete(`/slice/${sliceId}`);
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

// Access Management

export interface UpdateSliceAccessStatusRequest {
  accessStatus: "private" | "public" | "specific";
}

export const updateSliceAccessStatus = async (
  sliceId: string,
  data: UpdateSliceAccessStatusRequest,
): Promise<void> => {
  await apiClient.patch(`/slice/${sliceId}/access/status`, data);
};

export interface GrantSliceAccessRequest {
  email?: string;
  userId?: string;
  role: "viewer" | "editor";
}

export const grantSliceAccess = async (
  sliceId: string,
  data: GrantSliceAccessRequest,
): Promise<void> => {
  await apiClient.post(`/slice/${sliceId}/access/users`, data);
};

export const revokeSliceAccess = async (
  sliceId: string,
  userId: string,
): Promise<void> => {
  await apiClient.delete(`/slice/${sliceId}/access/users/${userId}`);
};

export interface SliceAccessUser {
  id: string; // slice_access id
  userId: string;
  role: "viewer" | "editor";
  user: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export interface SliceAccessListResponse {
  accessList: SliceAccessUser[];
}

export const getSliceAccessList = async (
  sliceId: string,
): Promise<SliceAccessListResponse> => {
  const response = await apiClient.get<SliceAccessListResponse>(
    `/slice/${sliceId}/access/users`,
  );
  return response.data;
};

export interface UpdateSliceAccessRoleRequest {
  role: "viewer" | "editor";
}

export const updateSliceAccessRole = async (
  sliceId: string,
  userId: string,
  data: UpdateSliceAccessRoleRequest,
): Promise<void> => {
  await apiClient.patch(`/slice/${sliceId}/access/users/${userId}`, data);
};
