import type { Request, Response } from "express";
import type {
  CreateSliceRequest,
  UpdateSliceRequest,
  SliceResponse,
  SlicesResponse,
  SliceBrainsResponse,
  DeleteSliceResponse,
} from "../types/slice.types";
import { db, slices, memos } from "@repo/db";
import { eq, and, like } from "drizzle-orm";
import {
  HttpStatus,
  createSliceSchema,
  updateSliceSchema,
  sliceIdParamSchema,
  sliceSearchQuerySchema,
} from "@repo/types";

// POST /slices - Create a new slice
export const handleCreateSlice = async (
  req: Request<{}, SliceResponse, CreateSliceRequest>,
  res: Response<SliceResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate request body with Zod
    const validation = createSliceSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { name, description } = validation.data;

    const [newSlice] = await db
      .insert(slices)
      .values({
        name,
        description: description || "",
        ownerId: userId,
      })
      .returning();

    if (!newSlice) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to create slice",
      } as any);
    }

    res.status(HttpStatus.CREATED).json({
      slice: newSlice,
    });
  } catch (error) {
    console.error("Create slice error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create slice" } as any);
  }
};

// GET /slices - Get all slices for the authenticated user
export const handleGetSlices = async (
  req: Request,
  res: Response<SlicesResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate query parameters with Zod
    const queryValidation = sliceSearchQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid query parameters",
        details: queryValidation.error.issues,
      } as any);
    }

    const { title } = queryValidation.data;

    let userSlices;

    if (title && typeof title === "string") {
      // Search slices by title (case-insensitive)
      const { like } = await import("drizzle-orm");
      userSlices = await db.query.slices.findMany({
        where: and(eq(slices.ownerId, userId), like(slices.name, `%${title}%`)),
        orderBy: (slices, { desc }) => [desc(slices.createdAt)],
      });
    } else {
      // Get all slices
      userSlices = await db.query.slices.findMany({
        where: eq(slices.ownerId, userId),
        orderBy: (slices, { desc }) => [desc(slices.createdAt)],
      });
    }

    res.json({
      slices: userSlices,
    });
  } catch (error) {
    console.error("Get slices error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get slices" } as any);
  }
};

// GET /slices/:sliceId - Get a specific slice
export const handleGetSlice = async (
  req: Request<{ sliceId: string }>,
  res: Response<SliceResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = sliceIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid slice ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { sliceId } = paramValidation.data;

    // Check if user can access this slice
    const { canAccessSlice } = await import("../helpers/slice.helpers");
    if (!(await canAccessSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to access this slice",
      } as any);
    }

    const slice = await db.query.slices.findFirst({
      where: eq(slices.id, sliceId),
    });

    if (!slice) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Slice not found",
      } as any);
    }

    res.json({
      slice,
    });
  } catch (error) {
    console.error("Get slice error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get slice" } as any);
  }
};

// PATCH /slices/:sliceId - Update a slice
export const handleUpdateSlice = async (
  req: Request<{ sliceId: string }, SliceResponse, UpdateSliceRequest>,
  res: Response<SliceResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = sliceIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid slice ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { sliceId } = paramValidation.data;

    // Check if user can manage this slice (owner only)
    const { canManageSlice } = await import("../helpers/slice.helpers");
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to update this slice",
      } as any);
    }

    // Validate body with Zod
    const bodyValidation = updateSliceSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: bodyValidation.error.issues,
      } as any);
    }

    const { name, description } = bodyValidation.data;

    // Build update object with only provided fields
    const updateData: Partial<UpdateSliceRequest> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "No fields to update",
      } as any);
    }

    const [updatedSlice] = await db
      .update(slices)
      .set(updateData)
      .where(eq(slices.id, sliceId))
      .returning();

    if (!updatedSlice) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to update slice",
      } as any);
    }

    res.json({
      slice: updatedSlice,
    });
  } catch (error) {
    console.error("Update slice error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update slice" } as any);
  }
};

// DELETE /slices/:sliceId - Delete a slice
export const handleDeleteSlice = async (
  req: Request<{ sliceId: string }>,
  res: Response<DeleteSliceResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = sliceIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid slice ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { sliceId } = paramValidation.data;

    // Check if user can manage this slice (owner only)
    const { canManageSlice } = await import("../helpers/slice.helpers");
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to delete this slice",
      } as any);
    }

    // Delete all memos in this slice first
    await db.delete(memos).where(eq(memos.sliceId, sliceId));

    // Delete all access grants for this slice
    const { sliceAccess } = await import("@repo/db");
    await db.delete(sliceAccess).where(eq(sliceAccess.sliceId, sliceId));

    // Finally delete the slice
    await db.delete(slices).where(eq(slices.id, sliceId));

    res.json({
      message: "Slice deleted successfully",
    });
  } catch (error) {
    console.error("Delete slice error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete slice" } as any);
  }
};

// GET /slices/:sliceId/brains - Get all brains/memos in a slice
export const handleGetSliceBrains = async (
  req: Request<{ sliceId: string }>,
  res: Response<SliceBrainsResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = sliceIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid slice ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { sliceId } = paramValidation.data;

    // Check if user can access this slice
    const { canAccessSlice } = await import("../helpers/slice.helpers");
    if (!(await canAccessSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to access this slice",
      } as any);
    }

    // Get all memos for this slice
    const sliceMemos = await db.query.memos.findMany({
      where: eq(memos.sliceId, sliceId),
      orderBy: (memos, { desc }) => [desc(memos.createdAt)],
    });

    res.json({
      sliceId,
      brains: sliceMemos,
    });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get slice brains" } as any);
  }
};

// PATCH /slices/:sliceId/access/status - Update slice access status
export const handleUpdateSliceAccessStatus = async (
  req: Request<
    { sliceId: string },
    any,
    import("../types/slice.types").UpdateSliceAccessStatusRequest
  >,
  res: Response<import("../types/slice.types").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers");

    // Check if user can manage this slice (owner only)
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to manage this slice",
      } as any);
    }

    // Validate request body
    const { updateSliceAccessStatusSchema } = await import("@repo/types");
    const validation = updateSliceAccessStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { accessStatus } = validation.data;

    // Update slice access status
    await db.update(slices).set({ accessStatus }).where(eq(slices.id, sliceId));

    res.json({
      message: `Slice access status updated to ${accessStatus}`,
    });
  } catch (error) {
    console.error("Update slice access status error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update slice access status" } as any);
  }
};

// POST /slices/:sliceId/access/users - Grant access to a user
export const handleGrantSliceAccess = async (
  req: Request<
    { sliceId: string },
    any,
    import("../types/slice.types").GrantSliceAccessRequest
  >,
  res: Response<import("../types/slice.types").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers");

    // Check if user can manage this slice (owner only)
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to manage this slice",
      } as any);
    }

    // Validate request body
    const { grantSliceAccessSchema } = await import("@repo/types");
    const validation = grantSliceAccessSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { email, userId: targetUserId, role } = validation.data;

    // Find user by email or userId
    const { users } = await import("@repo/db");
    let targetUser;

    if (targetUserId) {
      targetUser = await db.query.users.findFirst({
        where: eq(users.id, targetUserId),
      });
    } else if (email) {
      targetUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
    }

    if (!targetUser) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "User not found",
      } as any);
    }

    // Check if access already exists
    const { sliceAccess } = await import("@repo/db");
    const existingAccess = await db.query.sliceAccess.findFirst({
      where: and(
        eq(sliceAccess.sliceId, sliceId),
        eq(sliceAccess.userId, targetUser.id),
      ),
    });

    if (existingAccess) {
      // Update existing access
      await db
        .update(sliceAccess)
        .set({ role })
        .where(
          and(
            eq(sliceAccess.sliceId, sliceId),
            eq(sliceAccess.userId, targetUser.id),
          ),
        );

      return res.json({
        message: `Access updated for ${targetUser.email}`,
      });
    }

    // Create new access grant
    await db.insert(sliceAccess).values({
      sliceId,
      userId: targetUser.id,
      role,
    });

    res.json({
      message: `Access granted to ${targetUser.email}`,
    });
  } catch (error) {
    console.error("Grant slice access error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to grant slice access" } as any);
  }
};

// DELETE /slices/:sliceId/access/users/:userId - Revoke access from a user
export const handleRevokeSliceAccess = async (
  req: Request<{ sliceId: string; userId: string }>,
  res: Response<import("../types/slice.types").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId, userId: targetUserId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers");

    // Check if user can manage this slice (owner only)
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to manage this slice",
      } as any);
    }

    // Validate params
    const { userIdParamSchema } = await import("@repo/types");
    const validation = userIdParamSchema.safeParse({ userId: targetUserId });
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid user ID",
        details: validation.error.issues,
      } as any);
    }

    // Delete access grant
    const { sliceAccess } = await import("@repo/db");
    await db
      .delete(sliceAccess)
      .where(
        and(
          eq(sliceAccess.sliceId, sliceId),
          eq(sliceAccess.userId, targetUserId),
        ),
      );

    res.json({
      message: "Access revoked successfully",
    });
  } catch (error) {
    console.error("Revoke slice access error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to revoke slice access" } as any);
  }
};

// GET /slices/:sliceId/access/users - List all users with access
export const handleGetSliceAccessList = async (
  req: Request<{ sliceId: string }>,
  res: Response<import("../types/slice.types").SliceAccessListResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers");

    // Check if user can manage this slice (owner only)
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to view access list",
      } as any);
    }

    // Get slice
    const slice = await db.query.slices.findFirst({
      where: eq(slices.id, sliceId),
    });

    if (!slice) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Slice not found",
      } as any);
    }

    // Get all access grants with user details
    const { sliceAccess } = await import("@repo/db");
    const accessGrants = await db.query.sliceAccess.findMany({
      where: eq(sliceAccess.sliceId, sliceId),
      with: {
        user: true,
      },
    });

    const users = accessGrants.map((grant) => ({
      userId: grant.user.id,
      email: grant.user.email,
      name: grant.user.name,
      role: grant.role as "viewer" | "editor",
    }));

    res.json({
      sliceId,
      accessStatus: slice.accessStatus as "private" | "public" | "specific",
      users,
    });
  } catch (error) {
    console.error("Get slice access list error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get slice access list" } as any);
  }
};

// PATCH /slices/:sliceId/access/users/:userId - Update user's role
export const handleUpdateSliceAccessRole = async (
  req: Request<
    { sliceId: string; userId: string },
    any,
    import("../types/slice.types").UpdateSliceAccessRoleRequest
  >,
  res: Response<import("../types/slice.types").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId, userId: targetUserId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers");

    // Check if user can manage this slice (owner only)
    if (!(await canManageSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to manage this slice",
      } as any);
    }

    // Validate request body
    const { updateSliceAccessRoleSchema } = await import("@repo/types");
    const validation = updateSliceAccessRoleSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { role } = validation.data;

    // Update role
    const { sliceAccess } = await import("@repo/db");
    await db
      .update(sliceAccess)
      .set({ role })
      .where(
        and(
          eq(sliceAccess.sliceId, sliceId),
          eq(sliceAccess.userId, targetUserId),
        ),
      );

    res.json({
      message: `Role updated to ${role}`,
    });
  } catch (error) {
    console.error("Update slice access role error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update role" } as any);
  }
};
