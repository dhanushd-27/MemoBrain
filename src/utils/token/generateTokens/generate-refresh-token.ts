import { refreshTokenExpiry, refreshTokenSecret } from "@/utils/env/env";
import { SignJWT } from "jose";

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(refreshTokenSecret);
const REFRESH_TOKEN_EXPIRY: string = refreshTokenExpiry as string;

export const createRefreshToken = async (payload: {
  id: string,
  email: string
}) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(REFRESH_TOKEN_SECRET);
}