import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import passport from "../utils/passport.js";

import { authRouter } from "../routes/auth.routes.js";
import { userRouter } from "../routes/user.routes.js";
import { sliceRouter } from "../routes/slice.routes.js";
import { memoRouter } from "../routes/memo.routes.js";
import config from "../config/index.js";
import { loggerMiddleware } from "../middlewares/logger.middleware.js";

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: config.client.appUrl,
  }),
);
app.use(passport.initialize());

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/slice", sliceRouter);
app.use("/memo", memoRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
});

export default app;
