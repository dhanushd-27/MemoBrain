"use server"

import { Status } from "@/types/status-code.types";
import { ApiError } from "@/utils/api/api-error";
import { ApiResponse } from "@/utils/api/api-response-handler";
import { AsyncHandler } from "@/utils/async-handler"
import { accessTokenName } from "@/utils/env/env";
import { generateUrl } from "@/utils/other/randomUrlGenerator";
import { prisma } from "@/utils/prisma";
import { verifyAccessToken } from "@/utils/token/verifyTokens/verify-access-token";
import { cookies } from "next/headers";

export const shareBrain = AsyncHandler(async () => {
  const accessToken = (await cookies()).get(accessTokenName)?.value as string;

  const payload = await verifyAccessToken(accessToken);

  if(!payload) throw new ApiError(Status.Unauthorized, "Unauthorized User");

  const adminId = payload.id as string;

  const shareUrl = generateUrl();

  // await prisma.user.
  const response = await prisma.$transaction(async (tx) => {
    const isShareUrlPresent = await tx.user.findFirst({
      where: {
        id: adminId
      },
      select: {
        share: true,
        shareUrl: true
      }
    });

    if(isShareUrlPresent) return isShareUrlPresent.shareUrl

    await prisma.user.update({
      where: {
        id: adminId
      },
      data: {
        share: true,
        shareUrl: shareUrl
      }
    });
  });

  if(response) {
    return ApiResponse(Status.Success, "Share Brain Successfull", {
      brainUrl: response
    });
  }

  return ApiResponse(Status.Success, "Share Brain Successfull", {
    brainUrl: shareUrl
  });
});