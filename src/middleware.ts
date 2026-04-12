import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to handle cache control, session validation, role-based access, and security
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

// Auth pages that authenticated users should be redirected away from
const authPages = ["/auth/signin", "/auth/signup"];

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

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Get session token from cookies
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const authToken = request.cookies.get("authToken")?.value;

  const isAuthenticated = Boolean(sessionToken || authToken);
  const userRole = authToken || null;

  // Check if this is an auth page (signin/signup)
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // If user is authenticated and visiting an auth page, redirect to their dashboard
  if (isAuthenticated && isAuthPage) {
    const dashboardPath = getDashboardPath(userRole || "user");
    return NextResponse.redirect(new URL(dashboardPath, request.url), {
      status: 307,
    });
  }

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
      // Redirect to their own dashboard instead
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
