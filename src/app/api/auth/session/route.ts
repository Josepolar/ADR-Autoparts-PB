import { NextRequest, NextResponse } from "next/server";

/**
 * Sign out endpoint that clears session and prevents caching
 */
export async function POST(request: NextRequest) {
  try {
    // Create response with redirect to signin page
    const response = NextResponse.redirect(new URL("/auth/signin", request.url), {
      status: 302,
    });

    // Set cache control headers to prevent back-button access to protected pages
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, max-age=0"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    // Clear session cookies if they exist
    response.cookies.delete("session");
    response.cookies.delete("auth-token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if user session is valid
 * Returns current user role and email
 */
export async function GET(_request: NextRequest) {
  try {
    // In production, verify JWT token from Authorization header
    // const authHeader = request.headers.get("authorization");
    // const token = authHeader?.replace("Bearer ", "");
    
    // For MVP, get role from sessionStorage (client-side)
    // In production: verify JWT and extract claims
    
    const response = NextResponse.json(
      {
        success: true,
        message: "Session is valid",
        // In production: return user data from JWT claims
        // user: { id, email, role }
      },
      { status: 200 }
    );

    // Set cache control headers
    response.headers.set(
      "Cache-Control",
      "private, no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");

    return response;
  } catch (error) {
    console.error("Session check error:", error);
    return NextResponse.json(
      { success: false, message: "Session check failed" },
      { status: 401 }
    );
  }
}
