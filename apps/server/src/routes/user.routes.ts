import { Router } from "express";
import { handleGetMe } from "../services/user.services";

export const userRouter = Router()

userRouter.get("/me", handleGetMe)