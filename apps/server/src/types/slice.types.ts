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
