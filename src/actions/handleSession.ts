"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api-error";
import { ApiResponse } from "@/utils/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { prisma } from "@/utils/prisma";
import { createAccessToken } from "@/utils/token/generateTokens/generate-access-token";
import argon2 from "argon2";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET as string);

export const handleSession = AsyncHandler(async () => {
  const clientRefreshToken = (await cookies()).get("brainly_token");

  if(!clientRefreshToken) throw new ApiError(Status.NotFound, "Cookie Not Found");
  
   const tokenVal = clientRefreshToken.value;
  const { payload }= await jwtVerify(tokenVal, REFRESH_TOKEN_SECRET);

  // check if token in db and token in client are same
  const user = await prisma.user.findFirst({
    where: {
      email: payload.email as string
    }
  })

  const hashedServerRefreshToken = user?.refreshToken as string;

  const isValid = await argon2.verify(hashedServerRefreshToken, clientRefreshToken.value);

  if(!isValid) throw new ApiError(Status.Forbidden, "Unauthorized User");

  const newAccessToken = await createAccessToken(clientRefreshToken.value);

  return ApiResponse(Status.Accepted, "User Authentication", {
    sessionToken: newAccessToken
  });
});