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

export const shareBrain = AsyncHandler(async (brainId: number) => {
  const accessToken = (await cookies()).get(accessTokenName)?.value as string;

  const payload = await verifyAccessToken(accessToken);

  if(!payload) throw new ApiError(Status.Unauthorized, "Unauthorized User");

  const adminId = payload.id as string;

  const shareUrl = generateUrl();

  await prisma.content.update({
    where: {
      adminId,
      id: brainId
    },
    data: {
      share: true,
      shareUrl
    }
  });

  return ApiResponse(Status.Success, "Share Brain Successfull", {
    data: {
      brainUrl: shareUrl
    }
  });
});