import * as jose from "jose"
import { verifyRefreshToken } from "../verifyTokens/verify-refresh-token";
import { accessTokenExpiry, accessTokenSecret } from "@/utils/env/env";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(accessTokenSecret)
const ACCESS_TOKEN_EXPIRY: string = accessTokenExpiry as string;

export const createAccessToken = async (refreshToken: string) => {
  const payload = await verifyRefreshToken(refreshToken);
  if(!payload) return null;
  
  return await new jose.SignJWT({
    id: payload.id,
    email: payload.email,
    username: payload.username
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET);
}