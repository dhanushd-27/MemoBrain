import { Router } from "express";
import {
  handleCreateSlice,
  handleGetSlices,
  handleGetSlice,
  handleUpdateSlice,
  handleDeleteSlice,
  handleGetSliceBrains,
  handleUpdateSliceAccessStatus,
  handleGrantSliceAccess,
  handleRevokeSliceAccess,
  handleGetSliceAccessList,
  handleUpdateSliceAccessRole,
} from "../services/slice.services.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const sliceRouter = Router();

sliceRouter.use(authMiddleware);

// Slice CRUD routes
sliceRouter.post("/", handleCreateSlice);
sliceRouter.get("/", handleGetSlices);
sliceRouter.get("/:sliceId", handleGetSlice);
sliceRouter.patch("/:sliceId", handleUpdateSlice);
sliceRouter.delete("/:sliceId", handleDeleteSlice);
sliceRouter.get("/:sliceId/brains", handleGetSliceBrains);

// Slice access management routes
sliceRouter.patch("/:sliceId/access/status", handleUpdateSliceAccessStatus);
sliceRouter.post("/:sliceId/access/users", handleGrantSliceAccess);
sliceRouter.get("/:sliceId/access/users", handleGetSliceAccessList);
sliceRouter.patch(
  "/:sliceId/access/users/:userId",
  handleUpdateSliceAccessRole,
);
sliceRouter.delete("/:sliceId/access/users/:userId", handleRevokeSliceAccess);
