import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define public pages
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => pathname === path);

  // Get session token from cookies
  const sessionToken = request.cookies.get("sessionToken");
  const isAuthenticated = !!sessionToken;

  // If the path is protected and user is not authenticated → redirect to login
  if (!isPublicPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // optional redirect back
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", // Home
    "/ask", // Ask page
    "/answer/:path*", // Any /answer/:id
    "/login",
    "/register",
  ],
};
