"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler"
import { prisma } from "@/utils/prisma";

export const getBrainWithUrl = AsyncHandler( async (shareUrl: string) => {
  const brainData = await prisma.content.findFirst({
    where: {
      shareUrl
    }
  });

  if(!brainData) throw new ApiError(Status.NotFound, "Brain Not Found");

  return ApiResponse(Status.Accepted, "Brain Found", {
    type: brainData.type,
    tags: brainData.tags,
    url: brainData.url,
    title: brainData.title,
  })
});