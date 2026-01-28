import type { Request, Response } from "express";
import type {
  CreateMemoRequest,
  UpdateMemoRequest,
  MemoResponse,
  DeleteMemoResponse,
} from "../types/memo.types";
import { db, memos, slices } from "@repo/db";
import { eq, and } from "drizzle-orm";

// POST /memo - Create a new memo
export const handleCreateMemo = async (
  req: Request<{}, MemoResponse, CreateMemoRequest>,
  res: Response<MemoResponse>,
) => {
  try {
    const { type, title, content, sliceId, pinned } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    if (!type || !content || !sliceId) {
      return res.status(400).json({
        error: "Type, content, and sliceId are required",
      } as any);
    }

    // Verify that the slice exists and belongs to the user
    const slice = await db.query.slices.findFirst({
      where: and(eq(slices.id, sliceId), eq(slices.ownerId, userId)),
    });

    if (!slice) {
      return res.status(404).json({
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
      return res.status(500).json({
        error: "Failed to create memo",
      } as any);
    }

    res.status(201).json({
      memo: newMemo,
    });
  } catch (error) {
    console.error("Create memo error:", error);
    res.status(500).json({ error: "Failed to create memo" } as any);
  }
};

// GET /memo/:id - Get a specific memo
export const handleGetMemo = async (
  req: Request<{ id: string }>,
  res: Response<MemoResponse>,
) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    const memo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!memo) {
      return res.status(404).json({
        error: "Memo not found",
      } as any);
    }

    // Verify ownership via slice
    const slice = await db.query.slices.findFirst({
      where: and(eq(slices.id, memo.sliceId), eq(slices.ownerId, userId)),
    });

    if (!slice) {
      return res.status(403).json({
        error: "You don't have access to this memo",
      } as any);
    }

    res.json({
      memo,
    });
  } catch (error) {
    console.error("Get memo error:", error);
    res.status(500).json({ error: "Failed to get memo" } as any);
  }
};

// PUT /memo/:id - Update a memo
export const handleUpdateMemo = async (
  req: Request<{ id: string }, MemoResponse, UpdateMemoRequest>,
  res: Response<MemoResponse>,
) => {
  try {
    const { id } = req.params;
    const { type, title, content, pinned } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    // Check if memo exists
    const existingMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!existingMemo) {
      return res.status(404).json({
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
      return res.status(403).json({
        error: "You don't have access to this memo",
      } as any);
    }

    // Build update object with only provided fields
    const updateData: Partial<UpdateMemoRequest> = {};
    if (type !== undefined) updateData.type = type;
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (pinned !== undefined) updateData.pinned = pinned;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No fields to update",
      } as any);
    }

    const [updatedMemo] = await db
      .update(memos)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(memos.id, id))
      .returning();

    if (!updatedMemo) {
      return res.status(500).json({
        error: "Failed to update memo",
      } as any);
    }

    res.json({
      memo: updatedMemo,
    });
  } catch (error) {
    console.error("Update memo error:", error);
    res.status(500).json({ error: "Failed to update memo" } as any);
  }
};

// DELETE /memo/:id - Delete a memo
export const handleDeleteMemo = async (
  req: Request<{ id: string }>,
  res: Response<DeleteMemoResponse>,
) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    // Check if memo exists
    const existingMemo = await db.query.memos.findFirst({
      where: eq(memos.id, id),
    });

    if (!existingMemo) {
      return res.status(404).json({
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
      return res.status(403).json({
        error: "You don't have access to this memo",
      } as any);
    }

    await db.delete(memos).where(eq(memos.id, id));

    res.json({
      message: "Memo deleted successfully",
    });
  } catch (error) {
    console.error("Delete memo error:", error);
    res.status(500).json({ error: "Failed to delete memo" } as any);
  }
};
