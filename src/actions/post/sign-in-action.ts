"use server"

import { SignUpSchema, SignUpZodSchema } from "@/types/user.types";
import { Prisma } from "@prisma/client";

export const SignUpAction = (payload: SignUpSchema) => {
  const parsedData = SignUpZodSchema.safeParse(payload);

  if(!parsedData) {
    return null;
  }

  
};