import { NextRequest, NextResponse } from "next/server";

// Public routes that don't require authentication
const publicRoutes = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/autoecu",
  "/parts",
  "/rapide",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    const response = NextResponse.next();
    // Even public routes shouldn't be cached to prevent auth state issues
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    return response;
  }

  // Get user role from sessionStorage (client-side) or query parameter (MVP fallback)
  // In production: extract from JWT token in Authorization header or Cookie
  const url = request.nextUrl;
  const roleParam = url.searchParams.get("role") || "user";
  
  // Check if user is trying to access protected routes
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/autoecu/upload");
  const isStaffRoute = pathname.startsWith("/staff");

  // Route protection logic with proper role checks
  if (isAdminRoute && roleParam !== "admin") {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (isStaffRoute && !["admin", "staff"].includes(roleParam)) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Allow user routes (including staff and admin if they have those roles)
  const response = NextResponse.next();
  
  // Set critical cache headers to prevent back-button logout
  // These headers ensure auth pages and protected content are never cached
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  
  // Prevent cached authentication state
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
