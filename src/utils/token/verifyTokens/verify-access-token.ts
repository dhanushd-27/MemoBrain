import { accessTokenSecret } from "@/utils/env/env";
import { jwtVerify } from "jose"

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(accessTokenSecret);

export const verifyAccessToken = async (accessToken: string) => {
  try {
    const { payload } = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return null;
  }
}