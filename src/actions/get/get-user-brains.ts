"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { accessTokenName } from "@/utils/env/env"
import { prisma } from "@/utils/prisma";
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token";
import { cookies } from "next/headers"

export const getUserBrains = AsyncHandler(async () => {
  const cookieStore = (await cookies());
  const accessToken = cookieStore.get(accessTokenName)?.value;

  if(!accessToken) throw new ApiError(Status.Forbidden, "Invalid Token");

  const payload = await verifyAccessToken(accessToken);

  if(!payload) throw new ApiError(Status.Unauthorized, "Token Expired");

  const userId = payload.id as string;

  const brains = await prisma.user.findFirst({
    where: {
      id: userId
    },
    select: {
      brains: true
    }
  });

  return ApiResponse(Status.Success, "Brains Found", brains)
});