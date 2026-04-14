import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy to handle cache control, session validation, role-based access, and security
 * (Next.js 16+ uses proxy.ts instead of middleware.ts)
 */

// Routes that require authentication (any role)
const protectedRoutes = [
  "/user",
  "/dashboard",
  "/inventory",
  "/settings",
];

// Role-specific routes: only accessible by the specified role
const roleRoutes: Record<string, string[]> = {
  admin: ["/admin"],
  staff: ["/staff"],
};

/**
 * Get the dashboard path for a given role
 */
function getDashboardPath(role: string): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "staff":
      return "/staff";
    default:
      return "/";
  }
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session token from cookies
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const authToken = request.cookies.get("authToken")?.value;

  const isAuthenticated = Boolean(sessionToken || authToken);
  const userRole = authToken || null;

  // Auth pages are always accessible — the pages themselves handle
  // redirect logic client-side via sessionStorage checks.
  // This avoids stale cookies causing infinite redirects to "/".

  // Check if the route requires a specific role
  const isRoleRoute = Object.entries(roleRoutes).find(([, routes]) =>
    routes.some((route) => pathname.startsWith(route))
  );

  // Check if the route is a general protected route
  const isProtectedRoute =
    isRoleRoute ||
    protectedRoutes.some((route) => pathname.startsWith(route));

  // Handle protected routes - require authentication
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url), {
      status: 307,
    });
  }

  // Handle role-specific routes - require correct role
  if (isRoleRoute && isAuthenticated) {
    const [requiredRole] = isRoleRoute;
    if (userRole !== requiredRole) {
      // User is authenticated but doesn't have the right role
      const dashboardPath = getDashboardPath(userRole || "user");
      return NextResponse.redirect(new URL(dashboardPath, request.url), {
        status: 307,
      });
    }
  }

  // Create response
  let response: NextResponse;

  // If it's an API route, handle specially
  if (pathname.startsWith("/api")) {
    response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  } else if (isProtectedRoute) {
    response = NextResponse.next();
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
  } else {
    response = NextResponse.next();
    response.headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
  }

  return response;
}

/**
 * Configuration for proxy
 * Matches all routes except static assets
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
