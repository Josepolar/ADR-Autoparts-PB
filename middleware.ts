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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  // Check if user is trying to access protected routes
  const isAdminRoute = pathname.startsWith("/admin") || pathname.startsWith("/autoecu/upload");
  const isStaffRoute = pathname.startsWith("/staff");

  // For MVP: detect role from query params or default to user
  // In production: extract from JWT token in Authorization header
  const url = request.nextUrl;
  const roleParam = url.searchParams.get("role") || "user";

  // Route protection logic
  if (isAdminRoute && roleParam !== "admin") {
    // Redirect non-admin users trying to access admin routes
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (isStaffRoute && !["admin", "staff"].includes(roleParam)) {
    // Redirect non-staff users trying to access staff routes
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
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
