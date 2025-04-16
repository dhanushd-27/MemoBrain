"use server"

import { ErrorMessage } from "@/types/error.types";
import { Status } from "@/types/status-code.types";
import { SignUpSchema, SignUpZodSchema } from "@/types/user.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { prisma } from "@/utils/prisma";
import argon2 from 'argon2'

export const SignUpAction = AsyncHandler(async (payload: SignUpSchema) => {
  const parsedData = SignUpZodSchema.safeParse(payload);

  if(!parsedData.data && !parsedData.success) {
    throw new ApiError(Status.InvalidData, ErrorMessage.InvalidData)
  }

  const { username, email, password } = parsedData.data;

  const isFound = await prisma.user.findFirst({
    where: {
      email
    }
  });

  if(isFound){ 
    throw new ApiError(Status.Conflict, ErrorMessage.UserExists)
  };

  const hashedPassword = await argon2.hash(password);

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    }
  });

  return ApiResponse(Status.Created, "User Created Successfully");
});