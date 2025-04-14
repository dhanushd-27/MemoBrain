import { SignJWT } from "jose";

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET as string);
const REFRESH_TOKEN_EXPIRY: string = process.env.REFRESH_TOKEN_EXPIRY as string;

export const createRefreshToken = async () => {
  return new SignJWT()
    .setExpirationTime(REFRESH_TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(REFRESH_TOKEN_SECRET);
}