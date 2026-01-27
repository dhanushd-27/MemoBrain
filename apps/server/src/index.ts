import express from "express";
import type { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";

import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import config from "./config";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: config.client.appUrl,
  }),
);

app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
});
