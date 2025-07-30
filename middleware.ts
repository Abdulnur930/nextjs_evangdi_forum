// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Define the protected paths
  const protectedPaths = ["/ask", "/answer"]; // '/answer' will match '/answer/:id' via the matcher

  // Get the current path
  const { pathname } = request.nextUrl;

  // Check if the current path is one of the protected paths
  // Use .startsWith for '/answer' to cover '/answer/:id'
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // --- IMPORTANT: This is where you check user authentication ---
  // Assuming you set a cookie named 'sessionToken' upon successful login.
  // In a real application, you would also verify this token/cookie on the server.
  const sessionToken = request.cookies.get("sessionToken"); // Or 'auth_token', 'next-auth.session-token', etc.
  const isAuthenticated = !!sessionToken; // Simple check: true if cookie exists, false otherwise

  // If the user is trying to access a protected path AND is NOT authenticated
  if (isProtectedPath && !isAuthenticated) {
    // Redirect to the login page
    const loginUrl = new URL("/login", request.url);
    // Optionally, add a redirect parameter to return to the original page after login
    // loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated OR is accessing a non-protected path, allow the request to proceed
  return NextResponse.next();
}

// Configure the matcher to run this middleware only on relevant paths
export const config = {
  matcher: [
    "/ask",
    "/answer/:path*", // This will match /answer and /answer/any-id
    // Add other paths here if they need authentication later
    "/((?!api|_next/static|_next/image|favicon.ico|login|register).*)", // Optional: exclude specific public paths if needed
  ],
};
