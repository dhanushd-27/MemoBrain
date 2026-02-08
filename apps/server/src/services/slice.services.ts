import type { Request, Response } from "express";
import type {
  CreateSliceRequest,
  UpdateSliceRequest,
  SliceResponse,
  SlicesResponse,
  SliceBrainsResponse,
  DeleteSliceResponse,
} from "../types/slice.types.js";
import { db, slices, memos } from "@repo/db";
import { eq, and, like } from "drizzle-orm";
import {
  HttpStatus,
  createSliceSchema,
  updateSliceSchema,
  sliceIdParamSchema,
  sliceSearchQuerySchema,
} from "@repo/types";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import type { Memo } from "@repo/types";

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
    const { canAccessSlice } = await import("../helpers/slice.helpers.js");
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
    const { canManageSlice } = await import("../helpers/slice.helpers.js");
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
    const { canManageSlice } = await import("../helpers/slice.helpers.js");
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
    const { canAccessSlice } = await import("../helpers/slice.helpers.js");
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
      brains: sliceMemos as unknown as import("@repo/types").Memo[],
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
    import("../types/slice.types.js").UpdateSliceAccessStatusRequest
  >,
  res: Response<import("../types/slice.types.js").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers.js");

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
    import("../types/slice.types.js").GrantSliceAccessRequest
  >,
  res: Response<import("../types/slice.types.js").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers.js");

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
  res: Response<import("../types/slice.types.js").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId, userId: targetUserId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers.js");

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
  res: Response<import("../types/slice.types.js").SliceAccessListResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers.js");

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
    import("../types/slice.types.js").UpdateSliceAccessRoleRequest
  >,
  res: Response<import("../types/slice.types.js").SliceAccessResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    const { sliceId, userId: targetUserId } = req.params;
    const { canManageSlice } = await import("../helpers/slice.helpers.js");

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

/**
 * Formats memo data for LLM consumption, extracting only relevant information
 * and limiting content length to manage token usage
 */
function formatMemoForDescription(memo: Memo): string {
  const parts: string[] = [];
  
  // Add type and title if available
  if (memo.title) {
    parts.push(`[${memo.type}] ${memo.title}`);
  } else {
    parts.push(`[${memo.type}]`);
  }
  
  // Add pinned indicator
  if (memo.pinned) {
    parts.push("⭐ PINNED");
  }
  
  // Extract relevant content based on type
  switch (memo.type) {
    case "TEXT": {
      const text = memo.content.text;
      // Limit text length to ~500 chars to manage tokens
      parts.push(text.length > 500 ? `${text.substring(0, 500)}...` : text);
      break;
    }
      
    case "TODO": {
      const todos = memo.content.items;
      const completedCount = todos.filter(t => t.completed).length;
      parts.push(`${completedCount}/${todos.length} completed`);
      // Include todo items (limit to first 5)
      const todoTexts = todos.slice(0, 5).map(t => `- ${t.text}${t.completed ? ' ✓' : ''}`).join('\n');
      parts.push(todoTexts);
      if (todos.length > 5) parts.push(`... and ${todos.length - 5} more items`);
      break;
    }
      
    case "LINK": {
      parts.push(`URL: ${memo.content.url}`);
      if (memo.content.note) {
        const note = memo.content.note.length > 200 
          ? `${memo.content.note.substring(0, 200)}...` 
          : memo.content.note;
        parts.push(`Note: ${note}`);
      }
      if (memo.content.source) {
        parts.push(`Source: ${memo.content.source}`);
      }
      break;
    }
      
    case "QA": {
      parts.push(`Q: ${memo.content.question}`);
      const answer = memo.content.answer.length > 300 
        ? `${memo.content.answer.substring(0, 300)}...` 
        : memo.content.answer;
      parts.push(`A: ${answer}`);
      break;
    }
      
    case "CODE": {
      parts.push(`Language: ${memo.content.language}`);
      if (memo.content.note) {
        parts.push(`Note: ${memo.content.note}`);
      }
      // Include first few lines of code (limit to ~300 chars)
      const codePreview = memo.content.code.split('\n').slice(0, 10).join('\n');
      const codeText = codePreview.length > 300 
        ? `${codePreview.substring(0, 300)}...` 
        : codePreview;
      parts.push(`Code:\n${codeText}`);
      break;
    }
  }
  
  return parts.join('\n');
}

// POST /slices/:sliceId/generate-description - Generate description for a slice
export const handleGenerateSliceDescription = async (
  req: Request<{ sliceId: string }>,
  res: Response<{ description: string }>,
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
    const { canAccessSlice } = await import("../helpers/slice.helpers.js");
    if (!(await canAccessSlice(userId, sliceId))) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have permission to access this slice",
      } as any);
    }

    // Get the slice
    const slice = await db.query.slices.findFirst({
      where: eq(slices.id, sliceId),
    });

    if (!slice) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Slice not found",
      } as any);
    }

    // Get all memos for this slice
    const sliceMemos = await db.query.memos.findMany({
      where: eq(memos.sliceId, sliceId),
      orderBy: (memosTable, { desc }) => [desc(memosTable.createdAt)],
    });

    const memosList = sliceMemos as unknown as Memo[];

    // Handle empty slice
    if (memosList.length === 0) {
      return res.json({
        description: `A collection called "${slice.name}". Currently empty.`,
      });
    }

    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Google API key not configured",
      } as any);
    }

    // Initialize the model
    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GOOGLE_API_KEY,
    });

    // Limit memos to prevent token overflow (process up to 20 most recent/pinned)
    // Prioritize pinned memos, then recent ones
    const sortedMemos = [...memosList]
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
      .slice(0, 20);

    // Format memos into readable text
    const memosText = sortedMemos
      .map((memo, idx) => `Memo ${idx + 1}:\n${formatMemoForDescription(memo)}`)
      .join('\n\n---\n\n');

    // Count memo types for context
    const typeCounts = memosList.reduce((acc, memo) => {
      acc[memo.type] = (acc[memo.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const typeSummary = Object.entries(typeCounts)
      .map(([type, count]) => `${count} ${type}`)
      .join(', ');

    const systemPrompt = `You are an expert at creating concise, informative descriptions for knowledge collections. 
Your task is to analyze the content of a collection (called a "slice") and generate a brief, engaging description (2-3 sentences max) that captures:
- The main themes and topics covered
- The types of content included
- The overall purpose or focus

Be specific and informative, but keep it concise. Avoid generic phrases like "various topics" - instead mention actual themes you observe.`;

    const userPrompt = `Slice Name: "${slice.name}"
Current Description: ${slice.description || "None"}

Total Memos: ${memosList.length}
Content Types: ${typeSummary}
${sortedMemos.length < memosList.length ? `\n(Showing ${sortedMemos.length} most relevant memos)` : ''}

Memo Content:
${memosText}

Generate a concise description (2-3 sentences) for this slice based on the content above.`;

    const response = await model.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(userPrompt),
    ]);
    
    const content = typeof response.content === 'string' 
      ? response.content 
      : String(response.content);
    
    // Clean up the response (remove quotes if wrapped, trim whitespace)
    const description = content.trim().replace(/^["']|["']$/g, '');

    res.json({ description });
  } catch (error) {
    console.error("Generate slice description error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to generate description" } as any);
  }
};
