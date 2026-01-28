import { Router } from "express";
import {
  handleCreateSlice,
  handleGetSlices,
  handleGetSlice,
  handleUpdateSlice,
  handleDeleteSlice,
  handleGetSliceBrains,
} from "../services/slice.services";
import { authMiddleware } from "../middlewares/auth.middleware";

export const sliceRouter = Router();

sliceRouter.use(authMiddleware);
sliceRouter.post("/", handleCreateSlice);
sliceRouter.get("/", handleGetSlices);
sliceRouter.get("/:sliceId", handleGetSlice);
sliceRouter.patch("/:sliceId", handleUpdateSlice);
sliceRouter.delete("/:sliceId", handleDeleteSlice);
sliceRouter.get("/:sliceId/brains", handleGetSliceBrains);
