import { NextRequest, NextResponse } from "next/server";

/**
 * Sign in endpoint that sets session cookies
 * This allows the middleware to validate sessions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email || !role) {
      return NextResponse.json(
        { success: false, message: "Email and role are required" },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json(
      { success: true, message: "Signed in successfully" },
      { status: 200 }
    );

    // Set session cookies with proper security settings
    // sessionToken: Contains user session identifier
    response.cookies.set("sessionToken", `session_${email}_${Date.now()}`, {
      httpOnly: false, // Set to true in production for security
      secure: false, // Set to true in production (HTTPS only)
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // authToken: Contains user role for middleware validation
    response.cookies.set("authToken", role, {
      httpOnly: false, // Set to true in production for security
      secure: false, // Set to true in production (HTTPS only)
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Store email for reference
    response.cookies.set("userEmail", email, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sign in error:", error);
    return NextResponse.json(
      { success: false, message: "Sign in failed" },
      { status: 500 }
    );
  }
}

/**
 * DELETE endpoint to clear session cookies on logout
 */
export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Signed out successfully" },
      { status: 200 }
    );

    // Clear all session cookies
    response.cookies.delete("sessionToken");
    response.cookies.delete("authToken");
    response.cookies.delete("userEmail");

    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json(
      { success: false, message: "Sign out failed" },
      { status: 500 }
    );
  }
}
