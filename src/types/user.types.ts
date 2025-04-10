import { z } from "zod";
export const SignUpZodSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 2 characters."}).max(26, { message: "Please limit your username to 26 characters or fewer."}),
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(8, { message: "Password must be at least of 8 characters" }).max(26, { message: "Please limit your password to 26 character or fewer" })
});

export type SignUpSchema = z.infer<typeof SignUpZodSchema>

export const SignInZodSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type SignInSchema = z.infer<typeof SignInZodSchema>