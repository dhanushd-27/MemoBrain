import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./utils/token/verifyTokens/verify-access-token";
import { accessTokenName, refreshTokenName } from "./utils/env/env";
import { handleAccessTokenExpiry } from './actions/handleSession';

const protectedRoutes = ["/dashboard"];
const redirectIfAuthenticatedRoutes = ["/", "/login"]; // Pages to redirect *away from* if already logged in

export async function middleware(req: NextRequest) {
  try {
    let token = (await cookies()).get(accessTokenName)?.value as string;

    if (!token) {
      token = await handleAccessTokenExpiry() as string;
    }

    let isValid = await verifyAccessToken(token);

    if (!isValid) {
      const refreshed = await handleAccessTokenExpiry();
      if (!refreshed) throw new Error("Refresh token expired");
      isValid = await verifyAccessToken(refreshed);
    }

    // 🔒 Redirect unauthenticated users *away from* protected routes
    if (!isValid && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // 🚀 Redirect authenticated users *away from* public routes like login or home
    if (isValid && redirectIfAuthenticatedRoutes.includes(req.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    (await cookies()).delete(accessTokenName);
    (await cookies()).delete(refreshTokenName);
    return NextResponse.redirect(new URL("/", req.url));
  }
}
