import type { Request, Response, NextFunction } from "express";
import type {
  SignUpRequest,
  SignInRequest,
  SignOutRequest,
  RefreshTokenRequest,
  AuthResponse,
  GoogleCallbackQuery,
} from "../types/auth.types";
import passport from "../utils/passport";
import { createToken } from "../utils/auth.helper";
import config from "../config";
import type { User } from "@repo/types";

export const handleSignUp = async (
  req: Request<{}, AuthResponse, SignUpRequest>,
  res: Response<AuthResponse>
) => {
  // TODO: Implement sign up logic
};

export const handleSignIn = async (
  req: Request<{}, AuthResponse, SignInRequest>,
  res: Response<AuthResponse>
) => {
  // TODO: Implement sign in logic
};

export const handleSignOut = async (
  req: Request<{}, {}, SignOutRequest>,
  res: Response<{ message: string }>
) => {
  // TODO: Implement sign out logic
};

export const handleGoogleSignIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Redirect to Google OAuth
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

export const handleGoogleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: Error | null, user: User | false, info: any) => {
      try {
        if (err) {
          return res.status(500).json({
            error: "Authentication failed",
            message: err.message,
          } as any);
        }

        if (!user) {
          return res.status(401).json({
            error: "Authentication failed",
            message: "No user found",
          } as any);
        }

        // Generate tokens
        const accessToken = createToken(user, config.jwt.accessSecret);
        const refreshToken = createToken(user, config.jwt.refreshSecret);

        // TODO: Store refresh token in database

        // Set tokens as HTTP-only cookies
        res.cookie(config.cookies.accessTokenName, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
        });

        res.cookie(config.cookies.refreshTokenName, refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        });

        const response: AuthResponse = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          },
          accessToken,
          refreshToken,
        };

        // Return user data and tokens
        res.json(response);
      } catch (error) {
        next(error);
      }
    }
  )(req, res, next);
};

export const handleRefresh = async (
  req: Request<{}, AuthResponse, RefreshTokenRequest>,
  res: Response<AuthResponse>
) => {
  // TODO: Implement token refresh logic
};