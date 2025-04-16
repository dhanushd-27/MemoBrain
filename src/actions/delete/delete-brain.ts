"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler";
import { accessTokenName } from "@/utils/env/env"
import { prisma } from "@/utils/prisma";
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token";
import { cookies } from "next/headers"

export const deleteBrain = AsyncHandler(async (brainId: number) => {
  const token = (await cookies()).get(accessTokenName)?.value as string;

  const payload = await verifyAccessToken(token);

  if(!payload) throw new ApiError(Status.Unauthorized, "Umauthorized User");

  const adminId = payload.id as string;

  await prisma.content.delete({
    where: {
      adminId,
      id: brainId
    }
  })

  return ApiResponse(Status.Success, "Brain Deleted Successfully")
});