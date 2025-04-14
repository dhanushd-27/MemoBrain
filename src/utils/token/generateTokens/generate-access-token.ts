import * as jose from "jose"
import { verifyRefreshToken } from "../verifyTokens/verify-refresh-token";

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string)
const ACCESS_TOKEN_EXPIRY: string = process.env.ACCESS_TOKEN_EXPIRY as string;

export const createAccessToken = async (refreshToken: string, payload: {
  id: string,
  email: string
}) => {
  const isValid = verifyRefreshToken(refreshToken);
  if(!isValid) return null;
  
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRY)
    .sign(ACCESS_TOKEN_SECRET);
}