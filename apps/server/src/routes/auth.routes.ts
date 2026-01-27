import { Router } from "express";
import { handleRefresh, handleGoogleCallback, handleGoogleSignIn, handleSignIn, handleSignOut, handleSignUp } from "../services/auth.services";

export const authRouter = Router();

authRouter.post("/signup", handleSignUp);
authRouter.post("/signin", handleSignIn);
authRouter.post("/signout", handleSignOut);

authRouter.get("/google", handleGoogleSignIn);
authRouter.get("/google/callback", handleGoogleCallback);

authRouter.post("/refresh", handleRefresh);
