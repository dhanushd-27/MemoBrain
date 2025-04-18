"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler"
import { prisma } from "@/utils/prisma";

export const getBrainWithUrl = AsyncHandler( async (shareUrl: string) => {
  const brainData = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        shareUrl
      },
      select: {
        id: true
      }
    });

    if(!user) throw new ApiError(Status.NotFound, "Brain Not Found");

    return await prisma.content.findMany({
      where: {
        adminId: user.id
      }
    })
  });
  
  return ApiResponse(Status.Accepted, "Brain Found", {
    brains: brainData
  });
});