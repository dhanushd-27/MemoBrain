"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { accessTokenName } from "@/utils/env/env"
import { prisma } from "@/utils/prisma";
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token";
import { cookies } from "next/headers"

export const getUserBrains = AsyncHandler(async ({ type }: { type: string }) => {
  const cookieStore = (await cookies());
  const accessToken = cookieStore.get(accessTokenName)?.value;

  if(!accessToken) throw new ApiError(Status.Forbidden, "Invalid Token");

  const payload = await verifyAccessToken(accessToken);

  if(!payload) throw new ApiError(Status.Unauthorized, "Token Expired");

  const userId = payload.id as string;

  if(type === "all") {
    const brains = await prisma.content.findMany({
      where: {
        adminId: userId,
      }
    });

    return ApiResponse(Status.Success, "Brains Found", brains)
  }

  const brains = await prisma.content.findMany({
    where: {
      adminId: userId,
      type: type
    }
  });

  return ApiResponse(Status.Success, "Brains Found", brains)
});