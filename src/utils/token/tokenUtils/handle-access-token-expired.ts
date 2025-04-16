import { cookies } from "next/headers"
import { verifyRefreshToken } from "../verifyTokens/verify-refresh-token";
import { accessTokenName, refreshTokenName } from "@/utils/env/env";
import { createAccessToken } from "../generateTokens/generate-access-token";
import { createRefreshToken } from "../generateTokens/generate-refresh-token";
import { prisma } from "@/utils/prisma";

// if access token expire -> take the refresh token veryify if it expired or not if it is logout, if it is not generate new access token and set the access token
export const handleAccessTokenExpiry = async () => {
  const refreshToken = (await cookies()).get(refreshTokenName);

  if(!refreshToken) return null;

  const isRefreshTokenValid = await verifyRefreshToken(refreshToken.value);

  if(!isRefreshTokenValid) return null;

  const id = isRefreshTokenValid.id as string;
  const email = isRefreshTokenValid.email as string;

  const newAccessToken = await createAccessToken(refreshToken.value) as string;
  const newRefreshToken = await createRefreshToken({
    id: id,
    email: email
  });

  (await cookies()).set(refreshTokenName, newRefreshToken, {
    name: refreshTokenName,
    httpOnly: true,
    sameSite: 'lax'
  });

  (await cookies()).set(accessTokenName, newAccessToken, {
    name: accessTokenName,
    httpOnly: true,
    sameSite: "lax",
  });

  await prisma.user.update({
    where: {
      email: email
    },
    data: {
      refreshToken: newRefreshToken
    }
  });
  
  return newAccessToken;
}