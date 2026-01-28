import { z } from "zod";

// Create Slice
export const createSliceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required").max(1000),
});

export type CreateSliceInput = z.infer<typeof createSliceSchema>;

// Update Slice
export const updateSliceSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(1000).optional(),
  })
  .refine((data) => data.name !== undefined || data.description !== undefined, {
    message: "At least one field must be provided",
  });

export type UpdateSliceInput = z.infer<typeof updateSliceSchema>;

// Slice ID Param
export const sliceIdParamSchema = z.object({
  sliceId: z.string().uuid("Invalid slice ID"),
});

export type SliceIdParam = z.infer<typeof sliceIdParamSchema>;

// Slice Search Query
export const sliceSearchQuerySchema = z.object({
  title: z.string().optional(),
});

export type SliceSearchQuery = z.infer<typeof sliceSearchQuerySchema>;
