import type { Slice } from "@repo/types";

// Request types
export interface CreateSliceRequest {
  name: string;
  description: string;
}

export interface UpdateSliceRequest {
  name?: string;
  description?: string;
}

// Response types
export interface SliceResponse {
  slice: Slice;
}

export interface SlicesResponse {
  slices: Slice[];
}

export interface SliceBrainsResponse {
  sliceId: string;
  brains: import("@repo/types").Memo[];
}

export interface DeleteSliceResponse {
  message: string;
}

// Slice Access types
export interface UpdateSliceAccessStatusRequest {
  accessStatus: "private" | "public" | "specific";
}

export interface GrantSliceAccessRequest {
  email?: string;
  userId?: string;
  role: "viewer" | "editor";
}

export interface UpdateSliceAccessRoleRequest {
  role: "viewer" | "editor";
}

export interface SliceAccessUser {
  userId: string;
  email: string;
  name: string | null;
  role: "viewer" | "editor";
}

export interface SliceAccessListResponse {
  sliceId: string;
  accessStatus: "private" | "public" | "specific";
  users: SliceAccessUser[];
}

export interface SliceAccessResponse {
  message: string;
}

export interface GenerateSliceDescriptionResponse {
  description: string;
}
