import { Router } from "express";
import { handleGetMe } from "../services/user.services.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const userRouter = Router();

userRouter.get("/me", authMiddleware, handleGetMe);
