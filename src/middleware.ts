// // So get to understand what are session tokens and what are refresh token,
// // Add protected routes - choose something that is better
// // redirect people to dashboard on successive login/ signup
// // during signup - go through a doc where find the best practice on where to redirect user on successfully signup
// // what is useSession hook

// import { NextRequest } from "next/server";

// // use protected routes to set a session in nextjs
// export default function middleware(req: NextRequest) {
  
// }

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "./utils/token/verifyTokens/verify-access-token";
import { accessTokenName, refreshTokenName } from "./utils/env/env";
import { handleAccessTokenExpiry } from './actions/handleSession';

const protectedRoutes = ["/dashboard", "/brain/"]; // Use startsWith instead of wildcard

export async function middleware(req: NextRequest) {
  try {
    let token = (await cookies()).get(accessTokenName)?.value as string;

    if(!token) {
      token = await handleAccessTokenExpiry() as string;
    };
    
    let isValid = await verifyAccessToken(token);

    if(!isValid) {
      const response = await handleAccessTokenExpiry();
      if(!response) throw Error("Refresh Token Expired");

      isValid = await verifyAccessToken(response);
    }

    // Redirect if not authenticated and accessing a protected route
    if (!isValid && protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next(); // Proceed if authorized
  } catch (error) {
    console.error("Middleware error:", error);
    (await cookies()).delete(accessTokenName);
    (await cookies()).delete(refreshTokenName);
    return NextResponse.redirect(new URL("/", req.url)); // Fail-safe redirect
  }
}

export const config = {
  matcher: ["/dashboard", "/brain/:path*"],
}