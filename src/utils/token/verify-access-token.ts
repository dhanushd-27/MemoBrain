import { jwtVerify } from "jose"

const ACCESS_TOKEN_SECRET = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET as string);

export const verifyAccessToken = async (accessToken: string) => {
  try {
    const payload = await jwtVerify(accessToken, ACCESS_TOKEN_SECRET);
    return payload;
  } catch (error) {
    const e = error as Error;
    console.log(e.message);
    return null;
  }
}