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

// Slice Access Status
export const sliceAccessStatusSchema = z.enum([
  "private",
  "public",
  "specific",
]);

export type SliceAccessStatus = z.infer<typeof sliceAccessStatusSchema>;

// Update Slice Access Status
export const updateSliceAccessStatusSchema = z.object({
  accessStatus: sliceAccessStatusSchema,
});

export type UpdateSliceAccessStatusInput = z.infer<
  typeof updateSliceAccessStatusSchema
>;

// Slice Access Role
export const sliceAccessRoleSchema = z.enum(["viewer", "editor"]);

export type SliceAccessRoleType = z.infer<typeof sliceAccessRoleSchema>;

// Grant Slice Access
export const grantSliceAccessSchema = z
  .object({
    email: z.string().email("Invalid email address").optional(),
    userId: z.string().uuid("Invalid user ID").optional(),
    role: sliceAccessRoleSchema,
  })
  .refine((data) => data.email !== undefined || data.userId !== undefined, {
    message: "Either email or userId must be provided",
  });

export type GrantSliceAccessInput = z.infer<typeof grantSliceAccessSchema>;

// Update Slice Access Role
export const updateSliceAccessRoleSchema = z.object({
  role: sliceAccessRoleSchema,
});

export type UpdateSliceAccessRoleInput = z.infer<
  typeof updateSliceAccessRoleSchema
>;

// User ID Param
export const userIdParamSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export type UserIdParam = z.infer<typeof userIdParamSchema>;
