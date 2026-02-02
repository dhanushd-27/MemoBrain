import type { Request, Response, NextFunction } from "express";
import type {
  SignUpRequest,
  SignInRequest,
  SignOutRequest,
  RefreshTokenRequest,
  AuthResponse,
} from "../types/auth.types.js";
import passport from "../utils/passport.js";
import {
  createToken,
  hashString,
  verifyString,
  verifyToken,
} from "../utils/auth.helper.js";
import config from "../config/index.js";
import type { User } from "@repo/types";
import { db, users, refreshTokens } from "@repo/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import {
  HttpStatus,
  signUpSchema,
  signInSchema,
  refreshTokenSchema,
} from "@repo/types";

export const handleSignUp = async (
  req: Request<{}, AuthResponse, SignUpRequest>,
  res: Response<AuthResponse>,
) => {
  try {
    // Validate request body with Zod
    const validation = signUpSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { name, email, password } = validation.data;

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({
        error: "User already exists",
      } as any);
    }

    // Hash password
    const passwordHash = await hashString(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        passwordHash,
        googleId: null,
      })
      .returning();

    if (!newUser) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to create user",
      } as any);
    }

    // Generate tokens
    const accessToken = createToken(
      newUser,
      config.jwt.accessSecret,
      config.cookies.accessTokenExpire,
    );
    const refreshToken = createToken(
      newUser,
      config.jwt.refreshSecret,
      config.cookies.refreshTokenExpire,
    );

    // Store refresh token
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await db.insert(refreshTokens).values({
      userId: newUser.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    // Set cookies
    res.cookie(config.cookies.accessTokenName, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(config.cookies.refreshTokenName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(HttpStatus.CREATED).json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Sign up error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Sign up failed" } as any);
  }
};

export const handleSignIn = async (
  req: Request<{}, AuthResponse, SignInRequest>,
  res: Response<AuthResponse>,
) => {
  try {
    // Validate request body with Zod
    const validation = signInSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    const { email, password } = validation.data;

    // Find user
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.passwordHash) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Invalid credentials",
      } as any);
    }

    // Verify password
    const isValid = await verifyString(password, user.passwordHash);
    if (!isValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Invalid credentials",
      } as any);
    }

    // Generate tokens
    const accessToken = createToken(
      user,
      config.jwt.accessSecret,
      config.cookies.accessTokenExpire,
    );
    const refreshToken = createToken(
      user,
      config.jwt.refreshSecret,
      config.cookies.refreshTokenExpire,
    );

    // Store refresh token
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Set cookies
    res.cookie(config.cookies.accessTokenName, accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(config.cookies.refreshTokenName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Sign in failed" } as any);
  }
};

export const handleSignOut = async (
  req: Request<{}, {}, SignOutRequest>,
  res: Response<{ message: string }>,
) => {
  try {
    // Get refresh token from cookie (preferred) or body
    const refreshToken =
      req.cookies[config.cookies.refreshTokenName] || req.body?.refreshToken;

    if (refreshToken) {
      const tokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

      // Revoke token
      await db
        .update(refreshTokens)
        .set({ revokedAt: new Date() })
        .where(eq(refreshTokens.tokenHash, tokenHash));
    }

    // Clear cookies
    res.clearCookie(config.cookies.accessTokenName);
    res.clearCookie(config.cookies.refreshTokenName);

    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Sign out error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Sign out failed" } as any);
  }
};

export const handleGoogleSignIn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })(req, res, next);
};

export const handleGoogleCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err: Error | null, user: User | false, info: any) => {
      try {
        if (err) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            error: "Authentication failed",
            message: err.message,
          } as any);
        }

        if (!user) {
          return res.status(HttpStatus.UNAUTHORIZED).json({
            error: "Authentication failed",
            message: "No user found",
          } as any);
        }

        // Generate tokens
        const accessToken = createToken(
          user,
          config.jwt.accessSecret,
          config.cookies.accessTokenExpire,
        );
        const refreshToken = createToken(
          user,
          config.jwt.refreshSecret,
          config.cookies.refreshTokenExpire,
        );

        // Store refresh token
        const tokenHash = crypto
          .createHash("sha256")
          .update(refreshToken)
          .digest("hex");
        await db.insert(refreshTokens).values({
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        // Set cookies
        res.cookie(config.cookies.accessTokenName, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 15 * 60 * 1000,
        });

        res.cookie(config.cookies.refreshTokenName, refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Redirect to client dashboard
        res.redirect(`${config.client.appUrl}/dashboard`);
      } catch (error) {
        next(error);
      }
    },
  )(req, res, next);
};

export const handleRefresh = async (
  req: Request<{}, AuthResponse, RefreshTokenRequest>,
  res: Response<AuthResponse>,
) => {
  try {
    // Validate request body with Zod (optional refresh token)
    const validation = refreshTokenSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(HttpStatus.INVALID_BODY).json({
        error: "Invalid request body",
        details: validation.error.issues,
      } as any);
    }

    // Get refresh token from cookie (preferred) or body
    const refreshToken =
      req.cookies[config.cookies.refreshTokenName] ||
      validation.data.refreshToken;

    if (!refreshToken) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Refresh token required",
      } as any);
    }

    // Verify token
    const decoded = verifyToken(refreshToken, config.jwt.refreshSecret) as any;
    const tokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    // Check if token exists and is valid
    const storedToken = await db.query.refreshTokens.findFirst({
      where: and(
        eq(refreshTokens.tokenHash, tokenHash),
        eq(refreshTokens.userId, decoded.id),
      ),
    });

    if (
      !storedToken ||
      storedToken.revokedAt ||
      storedToken.expiresAt < new Date()
    ) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "Invalid refresh token",
      } as any);
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.id),
    });

    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        error: "User not found",
      } as any);
    }

    // Revoke old token
    await db
      .update(refreshTokens)
      .set({ revokedAt: new Date() })
      .where(eq(refreshTokens.id, storedToken.id));

    // Generate new tokens
    const newAccessToken = createToken(
      user,
      config.jwt.accessSecret,
      config.cookies.accessTokenExpire,
    );
    const newRefreshToken = createToken(
      user,
      config.jwt.refreshSecret,
      config.cookies.refreshTokenExpire,
    );

    // Store new refresh token
    const newTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");
    await db.insert(refreshTokens).values({
      userId: user.id,
      tokenHash: newTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Set cookies
    res.cookie(config.cookies.accessTokenName, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie(config.cookies.refreshTokenName, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ error: "Token refresh failed" } as any);
  }
};
