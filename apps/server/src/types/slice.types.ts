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
  brains: any[]; // Will be typed properly when brain/memo types are finalized
}

export interface DeleteSliceResponse {
  message: string;
}
