import { z } from "zod";

// Sign Up
export const signUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// Sign In
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInInput = z.infer<typeof signInSchema>;

// Refresh Token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});

export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

// Sign Out
export const signOutSchema = z.object({
  refreshToken: z.string().optional(),
});

export type SignOutInput = z.infer<typeof signOutSchema>;
