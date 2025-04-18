"use server"

import { cookies } from "next/headers"
import { accessTokenName, refreshTokenName } from "@/utils/env/env";
import { verifyRefreshToken } from '../utils/token/verifyTokens/verify-refresh-token';
import { createAccessToken } from '@/utils/token/generateTokens/generate-access-token';

// if access token expire -> take the refresh token veryify if it expired or not if it is logout, if it is not generate new access token and set the access token
export const handleAccessTokenExpiry = async () => {
  const refreshToken = (await cookies()).get(refreshTokenName);

  if(!refreshToken) return null;

  const isRefreshTokenValid = await verifyRefreshToken(refreshToken.value);

  if(!isRefreshTokenValid) return null;

  const newAccessToken = await createAccessToken(refreshToken.value) as string;

  (await cookies()).set(accessTokenName, newAccessToken, {
    name: accessTokenName,
    httpOnly: true,
    sameSite: "lax",
  });

  return newAccessToken;
}