import { z } from "zod";
export const SignUpZodSchema = z.object({
  username: z.string().min(3).max(26),
  email: z.string().email(),
  password: z.string().min(8)
});

export type SignUpSchema = z.infer<typeof SignUpZodSchema>