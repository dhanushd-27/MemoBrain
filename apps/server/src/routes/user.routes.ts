import { Router } from "express";
import { handleGetMe } from "../services/user.services";
import { authMiddleware } from "../middlewares/auth.middleware";

export const userRouter = Router();

userRouter.get("/me", authMiddleware, handleGetMe);
