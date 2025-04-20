"use server"

import { createBrainSchema, createBrainZodSchema } from "@/types/brainType/brain"
import { Status } from "@/types/status-code.types"
import { ApiError } from "@/utils/api/api-error"
import { ApiResponse } from "@/utils/api/api-response-handler"
import { AsyncHandler } from "@/utils/async-handler"
import { accessTokenName } from "@/utils/env/env"
import { prisma } from "@/utils/prisma"
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token"
import { cookies } from "next/headers"

export const createBrain = AsyncHandler(async ({
  type,
  tags,
  title,
  url
}: createBrainSchema) => {
  const accessToken = (await cookies()).get(accessTokenName)?.value as string;

  const payload = await verifyAccessToken(accessToken);

  if(!payload) throw new ApiError(Status.Forbidden, "Unauthorized User");

  const adminId = payload.id as string;

  const parsedData = createBrainZodSchema.safeParse({ type, tags, title, url });

  if(!parsedData.success) {
    throw new ApiError(Status.InvalidData, "Invalid Data")
  }

  await prisma.content.create({
    data: {
      type,
      tags,
      title,
      url,
      adminId: adminId
    }
  });

  return ApiResponse(Status.Created, "Brain Created Successfully");
})