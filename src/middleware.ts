import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./utils/token/verifyTokens/verify-access-token";
import { accessTokenName, refreshTokenName } from "./utils/env/env";
import { handleAccessTokenExpiry } from "./actions/handleSession";

const unprotectedRoutes = ["/", "/login", "/signup"];
const protectedRoutes = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // 🍃 For unprotected routes, just check if user is already logged in
  if (unprotectedRoutes.includes(pathname)) {
    const cookieStore = await cookies();
    const token = cookieStore.get(accessTokenName)?.value;

    if (token) {
      const isValid = await verifyAccessToken(token);
      if (isValid) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next(); // Stay on same page if not authenticated
  }

  // 🔐 Proceed to protected logic
  const cookieStore = await cookies();
  // In the general auth logic
  let token = cookieStore.get(accessTokenName)?.value ?? undefined;



  try {
    if (!token) {
      const refreshed = await handleAccessTokenExpiry() as string | undefined;
      if (!refreshed && protectedRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      token = refreshed;
    }

    const isValid = await verifyAccessToken(token as string);

    if (!isValid && protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    cookieStore.delete(accessTokenName);
    cookieStore.delete(refreshTokenName);

    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  }
}
