// Sign a token and send it response
// Change api response handler to pass data only when needed status, message, payload in which you send token
"use server"

import argon2 from "argon2";
import { Status } from "@/types/status-code.types";
import { SignInSchema, SignInZodSchema } from "@/types/user.types";
import { prisma } from "@/utils/prisma";
import { ApiError } from "@/utils/api-error";
import { ApiResponse } from "@/utils/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { createAccessToken } from "@/utils/token/generateTokens/generate-access-token";
import { createRefreshToken } from "@/utils/token/generateTokens/generate-refresh-token";
import { cookies } from "next/headers";

export const SignInAction = AsyncHandler(async (payload: SignInSchema) => {
  const parsedData = SignInZodSchema.safeParse(payload);

  if(!parsedData.data && !parsedData.success)  throw new ApiError(Status.InvalidData, "Invalid Data Form Data");

  const { email, password } = parsedData.data;

  const isFound = await prisma.user.findFirst({
    where: {
      email
    }
  });

  if(!isFound) throw new ApiError(Status.NotFound, "User Doesn't Exist");

  const isValid = await argon2.verify(isFound.password, password);

  if(!isValid) {
    throw new ApiError(Status.Unauthorized, "Invalid Password");
  }

  const newRefreshToken = await createRefreshToken({ id: isFound.id, email: isFound.email });
  const newAccessToken = await createAccessToken(newRefreshToken, {
    id: isFound.id,
    email: isFound.email
  });

  (await cookies()).set("brainly_refresh_token", newRefreshToken, {
    name: "brainly_refresh_token",
    httpOnly: true,
    sameSite: 'lax',
  });

  if(!newAccessToken) throw new ApiError(Status.Unauthorized, "Invalid Refresh Token");

  return ApiResponse(Status.Accepted, "User Logged In Successfully", {
    token: `Bearer ${newAccessToken}`
  });
});