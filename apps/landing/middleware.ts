import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // 1. Check for access token OR refresh token
  const cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME || "access_token";
  const refreshCookieName =
    process.env.REFRESH_TOKEN_COOKIE_NAME || "refresh_token";

  const hasAccessToken = req.cookies.has(cookieName);
  const hasRefreshToken = req.cookies.has(refreshCookieName);

  // 2. If neither exists, redirect to sign-in
  if (!hasAccessToken && !hasRefreshToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin"; // Matches existing route: `apps/landing/app/(auth)/signin`
    return NextResponse.redirect(url);
  }

  // 3. If either exists, allow the request
  // (We do NOT validate JWTs here - that is for the backend / API layers)
  return NextResponse.next();
}

// 4. Protect specific routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
