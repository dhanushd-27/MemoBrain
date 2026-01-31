import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define protected routes
// Define protected routes
// Removed manual check array since matcher handles it by default

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // With the matcher set to /dashboard/:path*, this middleware ONLY runs on protected routes
  // So we don't need to manually check if route is protected

  const cookieName = process.env.ACCESS_TOKEN_COOKIE_NAME || "access_token";
  const accessToken = req.cookies.get(cookieName)?.value;

  if (!accessToken) {
    // Check for refresh token
    const refreshCookieName =
      process.env.REFRESH_TOKEN_COOKIE_NAME || "refresh_token";
    const refreshToken = req.cookies.get(refreshCookieName)?.value;

    if (refreshToken) {
      // Access expired but refresh exists -> Attempt silent refresh
      const from = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/token-refresh?from=${from}`, req.url),
      );
    }

    // No tokens, redirect to login
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.ACCESS_JWT_SECRET || "default_access_secret",
    );

    // Verify the token
    await jwtVerify(accessToken, secret);

    // Token is valid, allow request
    return NextResponse.next();
  } catch (error) {
    // Token invalid or expired, redirect to login
    return NextResponse.redirect(new URL("/signin", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
