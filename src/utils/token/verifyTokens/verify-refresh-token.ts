import { refreshTokenName, refreshTokenSecret } from "@/utils/env/env";
import { jwtVerify } from "jose"
import { cookies } from "next/headers";

const REFRESH_TOKEN_SECRET = new TextEncoder().encode(refreshTokenSecret);

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    const { payload }= await jwtVerify(refreshToken, REFRESH_TOKEN_SECRET);
    return payload;
  } catch (error) {
    const e = error as Error;
    (await cookies()).delete(refreshTokenName)
    console.log(e.message);
    return null;
  }
}