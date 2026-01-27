import type { Request, Response } from "express";
import type { UserProfileResponse } from "../types/user.types";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";

export const handleGetMe = async (
  req: Request,
  res: Response<UserProfileResponse>
) => {
  try {
    // User ID should be set by auth middleware
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      } as any);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      } as any);
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to get user",
    } as any);
  }
};