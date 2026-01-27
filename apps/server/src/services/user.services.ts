import type { Request, Response } from "express";
import type { UserProfileResponse } from "../types/user.types";

export const handleGetMe = async (
  req: Request,
  res: Response<UserProfileResponse>
) => {
  // TODO: Get authenticated user from req (set by auth middleware)
  // TODO: Return user profile
};