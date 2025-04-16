"use server"

import { Status } from "@/types/status-code.types"
import { ApiError } from "@/utils/api-error"
import { ApiResponse } from "@/utils/api-response-handler"
import { AsyncHandler } from "@/utils/async-handler"
import { accessTokenName } from "@/utils/env/env"
import { prisma } from "@/utils/prisma"
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token"
import { cookies } from "next/headers"

export const getAllBrains = AsyncHandler(async () => {
  const accessToken = (await cookies()).get(accessTokenName)?.value as string;

  const payload = await verifyAccessToken(accessToken);

  if(!payload) throw new ApiError(Status.Unauthorized, "Unauthorized User");

  const adminId = payload.id as string;

  const allBrains = await prisma.content.findMany({
    where: {
      adminId: adminId
    }
  })

  return ApiResponse(Status.Accepted, "Fetched All Brains Successfully", {
    brains: allBrains
  })
})