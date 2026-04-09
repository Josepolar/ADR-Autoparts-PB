import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware handler for checking role-based access
 */
export function checkRoleAccess(
  request: NextRequest,
  requiredRoles: string[]
): NextResponse | null {
  // In production, extract and verify JWT token
  // const authHeader = request.headers.get("authorization");
  const roleParam = request.nextUrl.searchParams.get("role") || "user";

  if (!requiredRoles.includes(roleParam)) {
    return NextResponse.json(
      { error: "Forbidden: Insufficient permissions", code: "FORBIDDEN" },
      { status: 403 }
    );
  }

  return null; // Access granted
}

/**
 * Generic 403 error response
 */
export function forbiddenResponse(message: string = "Access denied") {
  return NextResponse.json(
    {
      error: message,
      code: "FORBIDDEN",
    },
    { status: 403 }
  );
}

/**
 * Generic 401 error response
 */
export function unauthorizedResponse(message: string = "Unauthorized") {
  return NextResponse.json(
    {
      error: message,
      code: "UNAUTHORIZED",
    },
    { status: 401 }
  );
}
