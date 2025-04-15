import { jwtVerify } from "jose"

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET as string);

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    const { payload }= await jwtVerify(refreshToken, REFRESH_TOKEN_SECRET);
    return payload;
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return null;
  }
}