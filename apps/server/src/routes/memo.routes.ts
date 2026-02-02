import { Router } from "express";
import {
  handleCreateMemo,
  handleGetMemo,
  handleUpdateMemo,
  handleDeleteMemo,
} from "../services/memo.services.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const memoRouter = Router();

memoRouter.use(authMiddleware);

memoRouter.post("/", handleCreateMemo);
memoRouter.get("/:id", handleGetMemo);
memoRouter.patch("/:id", handleUpdateMemo);
memoRouter.delete("/:id", handleDeleteMemo);
