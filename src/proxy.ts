import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle cache control, session validation, and security
 */

// Protected routes that require authentication
const protectedRoutes = [
  "/admin",
  "/staff",
  "/user",
  "/dashboard",
  "/inventory",
  "/settings",
];

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session token from cookies
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const authToken = request.cookies.get("authToken")?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Handle protected routes
  if (isProtectedRoute && !sessionToken && !authToken) {
    // User is not authenticated, redirect to signin
    return NextResponse.redirect(new URL("/auth/signin", request.url), {
      status: 307,
    });
  }

  // Create response
  let response: NextResponse;

  // If it's an API route, handle specially
  if (pathname.startsWith("/api")) {
    response = NextResponse.next();
    // API responses should not be cached
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  } else if (isProtectedRoute) {
    // Protected pages should never be cached
    response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    // Prevent browsers from storing in local cache
    response.headers.set("Surrogate-Control", "no-store");
  } else {
    // Public pages can be cached
    response = NextResponse.next();
    response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  }

  return response;
}

/**
 * Configuration for middleware
 * Matches all routes except static assets
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
