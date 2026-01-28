import type { Request, Response } from "express";
import type {
  CreateMemoRequest,
  UpdateMemoRequest,
  MemoResponse,
  DeleteMemoResponse,
} from "../types/memo.types";
import { db, memos, slices } from "@repo/db";
import { eq, and } from "drizzle-orm";
import {
  HttpStatus,
  createMemoSchema,
  memoIdParamSchema,
  updateMemoSchema,
} from "@repo/types";

// POST /memo - Create a new memo
export const handleCreateMemo = async (
  req: Request<{}, MemoResponse, CreateMemoRequest>,
  res: Response<MemoResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate request body with Zod
    const validation = createMemoSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { type, title, content, sliceId, pinned } = validation.data;

    // Verify that the slice exists and belongs to the user
    const slice = await db.query.slices.findFirst({
      where: and(eq(slices.id, sliceId), eq(slices.ownerId, userId)),
    });

    if (!slice) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Slice not found or you don't have access",
      } as any);
    }

    const [newMemo] = await db
      .insert(memos)
      .values({
        type,
        title: title || null,
        content,
        sliceId,
        userId,
        pinned: pinned ?? false,
      })
      .returning();

    if (!newMemo) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to create memo",
      } as any);
    }

    res.status(HttpStatus.CREATED).json({
      memo: newMemo,
    });
  } catch (error) {
    console.error("Create memo error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to create memo" } as any);
  }
};

// GET /memo/:id - Get a specific memo
export const handleGetMemo = async (
  req: Request<{ id: string }>,
  res: Response<MemoResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = memoIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid memo ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { id } = paramValidation.data;

    const memo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!memo) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Memo not found",
      } as any);
    }

    // Verify ownership via slice
    const slice = await db.query.slices.findFirst({
      where: and(eq(slices.id, memo.sliceId), eq(slices.ownerId, userId)),
    });

    if (!slice) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have access to this memo",
      } as any);
    }

    res.json({
      memo,
    });
  } catch (error) {
    console.error("Get memo error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get memo" } as any);
  }
};

// PATCH /memo/:id - Update a memo
export const handleUpdateMemo = async (
  req: Request<{ id: string }, MemoResponse, UpdateMemoRequest>,
  res: Response<MemoResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = memoIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid memo ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { id } = paramValidation.data;

    // Validate body with Zod
    const bodyValidation = updateMemoSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: bodyValidation.error.issues,
      } as any);
    }

    const { type, title, content, pinned } = bodyValidation.data;

    // Check if memo exists
    const existingMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!existingMemo) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Memo not found",
      } as any);
    }

    // Verify ownership via slice
    const slice = await db.query.slices.findFirst({
      where: and(
        eq(slices.id, existingMemo.sliceId),
        eq(slices.ownerId, userId),
      ),
    });

    if (!slice) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have access to this memo",
      } as any);
    }

    // Build update object with only provided fields
    const updateData: Partial<UpdateMemoRequest> = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (pinned !== undefined) updateData.pinned = pinned;

    const [updatedMemo] = await db
      .update(memos)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(memos.id, id))
      .returning();

    if (!updatedMemo) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to update memo",
      } as any);
    }

    res.json({
      memo: updatedMemo,
    });
  } catch (error) {
    console.error("Update memo error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update memo" } as any);
  }
};

// DELETE /memo/:id - Delete a memo
export const handleDeleteMemo = async (
  req: Request<{ id: string }>,
  res: Response<DeleteMemoResponse>,
) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Unauthorized",
      } as any);
    }

    // Validate params with Zod
    const paramValidation = memoIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid memo ID",
        details: paramValidation.error.issues,
      } as any);
    }

    const { id } = paramValidation.data;

    // Check if memo exists
    const existingMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!existingMemo) {
      return res.status(HttpStatus.NOT_FOUND).json({
        error: "Memo not found",
      } as any);
    }

    // Verify ownership via slice
    const slice = await db.query.slices.findFirst({
      where: and(
        eq(slices.id, existingMemo.sliceId),
        eq(slices.ownerId, userId),
      ),
    });

    if (!slice) {
      return res.status(HttpStatus.FORBIDDEN).json({
        error: "You don't have access to this memo",
      } as any);
    }

    await db.delete(memos).where(eq(memos.id, id));

    res.json({
      message: "Memo deleted successfully",
    });
  } catch (error) {
    console.error("Delete memo error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete memo" } as any);
  }
};
