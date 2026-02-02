import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth.helper.js";
import config from "../config/index.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get token from cookie
    const token = req.cookies[config.cookies.accessTokenName];

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized - No token provided",
      });
    }

    // Verify token
    const decoded = verifyToken(token, config.jwt.accessSecret);

    // Attach user to request
    (req as any).user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Unauthorized - Invalid token",
    });
  }
};
