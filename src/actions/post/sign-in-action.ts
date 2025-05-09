"use server"

import argon2 from "argon2";
import { Status } from "@/types/status-code.types";
import { SignInSchema, SignInZodSchema } from "@/types/user.types";
import { prisma } from "@/utils/prisma";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { createRefreshToken } from "@/utils/token/generateTokens/generate-refresh-token";
import { cookies } from "next/headers";
import { createAccessToken } from "@/utils/token/generateTokens/generate-access-token";
import { accessTokenName, refreshTokenName } from "@/utils/env/env";

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

  const newRefreshToken = await createRefreshToken({ id: isFound.id, email: isFound.email, username: isFound.username });
  const newAccessToken = await createAccessToken(newRefreshToken) as string;

  const hashedRefreshToken = await argon2.hash(newRefreshToken);

  await prisma.user.update({
    where: { email },
    data: { refreshToken: hashedRefreshToken },
  });

  (await cookies()).set(refreshTokenName, newRefreshToken, {
    name: refreshTokenName,
    httpOnly: true,
    sameSite: 'lax',
  });

  (await cookies()).set(accessTokenName, newAccessToken, {
    name: accessTokenName,
    httpOnly: true,
    sameSite: 'lax'
  })

  return ApiResponse(Status.Accepted, "User Logged In Successfully");
});