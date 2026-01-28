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
import { eq, and } from "drizzle-orm";

// POST /slices - Create a new slice
export const handleCreateSlice = async (
  req: Request<{}, SliceResponse, CreateSliceRequest>,
  res: Response<SliceResponse>,
) => {
  try {
    const { name, description } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    if (!name || !description) {
      return res.status(400).json({
        error: "Name and description are required",
      } as any);
    }

    const [newSlice] = await db
      .insert(slices)
      .values({
        name,
        description,
        ownerId: userId,
      })
      .returning();

    if (!newSlice) {
      return res.status(500).json({
        error: "Failed to create slice",
      } as any);
    }

    res.status(201).json({
      slice: newSlice,
    });
  } catch (error) {
    console.error("Create slice error:", error);
    res.status(500).json({ error: "Failed to create slice" } as any);
  }
};

// GET /slices - Get all slices for the authenticated user
export const handleGetSlices = async (
  req: Request,
  res: Response<SlicesResponse>,
) => {
  try {
    const userId = (req as any).user?.id;
    const { title } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

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
    res.status(500).json({ error: "Failed to get slices" } as any);
  }
};

// GET /slices/:sliceId - Get a specific slice
export const handleGetSlice = async (
  req: Request<{ sliceId: string }>,
  res: Response<SliceResponse>,
) => {
  try {
    const { sliceId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    const slice = await db.query.slices.findFirst({
      where: and(eq(slices.id, sliceId), eq(slices.ownerId, userId)),
    });

    if (!slice) {
      return res.status(404).json({
        error: "Slice not found",
      } as any);
    }

    res.json({
      slice,
    });
  } catch (error) {
    console.error("Get slice error:", error);
    res.status(500).json({ error: "Failed to get slice" } as any);
  }
};

// PATCH /slices/:sliceId - Update a slice
export const handleUpdateSlice = async (
  req: Request<{ sliceId: string }, SliceResponse, UpdateSliceRequest>,
  res: Response<SliceResponse>,
) => {
  try {
    const { sliceId } = req.params;
    const { name, description } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    // Check if slice exists and belongs to user
    const existingSlice = await db.query.slices.findFirst({
      where: and(eq(slices.id, sliceId), eq(slices.ownerId, userId)),
    });

    if (!existingSlice) {
      return res.status(404).json({
        error: "Slice not found",
      } as any);
    }

    // Build update object with only provided fields
    const updateData: Partial<UpdateSliceRequest> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: "No fields to update",
      } as any);
    }

    const [updatedSlice] = await db
      .update(slices)
      .set(updateData)
      .where(and(eq(slices.id, sliceId), eq(slices.ownerId, userId)))
      .returning();

    if (!updatedSlice) {
      return res.status(500).json({
        error: "Failed to update slice",
      } as any);
    }

    res.json({
      slice: updatedSlice,
    });
  } catch (error) {
    console.error("Update slice error:", error);
    res.status(500).json({ error: "Failed to update slice" } as any);
  }
};

// DELETE /slices/:sliceId - Delete a slice
export const handleDeleteSlice = async (
  req: Request<{ sliceId: string }>,
  res: Response<DeleteSliceResponse>,
) => {
  try {
    const { sliceId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    // Check if slice exists and belongs to user
    const existingSlice = await db.query.slices.findFirst({
      where: and(eq(slices.id, sliceId), eq(slices.ownerId, userId)),
    });

    if (!existingSlice) {
      return res.status(404).json({
        error: "Slice not found",
      } as any);
    }

    await db
      .delete(slices)
      .where(and(eq(slices.id, sliceId), eq(slices.ownerId, userId)));

    res.json({
      message: "Slice deleted successfully",
    });
  } catch (error) {
    console.error("Delete slice error:", error);
    res.status(500).json({ error: "Failed to delete slice" } as any);
  }
};

// GET /slices/:sliceId/brains - Get all brains/memos in a slice
export const handleGetSliceBrains = async (
  req: Request<{ sliceId: string }>,
  res: Response<SliceBrainsResponse>,
) => {
  try {
    const { sliceId } = req.params;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    // Check if slice exists and belongs to user
    const slice = await db.query.slices.findFirst({
      where: and(eq(slices.id, sliceId), eq(slices.ownerId, userId)),
    });

    if (!slice) {
      return res.status(404).json({
        error: "Slice not found",
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
    console.error("Get slice brains error:", error);
    res.status(500).json({ error: "Failed to get slice brains" } as any);
  }
};
