import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import bcryptjs from "bcryptjs";

/**
 * Sign in endpoint – authenticates against DB, sets session cookies
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { success: false, message: "This account uses social login. Please sign in with Google or Facebook." },
        { status: 401 }
      );
    }

    // Check password — support both hashed and plain-text (for legacy/demo accounts)
    let passwordValid = false;
    if (user.passwordHash.startsWith("$2")) {
      // bcrypt hash
      passwordValid = await bcryptjs.compare(password, user.passwordHash);
    } else {
      // Plain-text fallback for legacy/demo accounts
      passwordValid = user.passwordHash === password;
    }

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Staff/mechanic accounts need admin verification
    if (user.role === "MECHANIC" && !user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Your staff account is pending admin verification. Please contact your administrator." },
        { status: 403 }
      );
    }

    // Map DB role to internal role string
    const roleMap: Record<string, string> = {
      ADMIN: "admin",
      MECHANIC: "staff",
      CUSTOMER: "user",
    };
    const role = roleMap[user.role] || "user";

    const response = NextResponse.json(
      { success: true, message: "Signed in successfully", user: { id: user.id, email: user.email, role, name: user.name } },
      { status: 200 }
    );

    response.cookies.set("sessionToken", `session_${email}_${Date.now()}`, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    response.cookies.set("authToken", role, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    response.cookies.set("userEmail", email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
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
export async function DELETE(_request: NextRequest) {
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
