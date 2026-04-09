import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Sign up endpoint that creates a new user
 * Defaults to "User" role for security
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Create new user with "CUSTOMER" role (default for security)
    // In production, hash the password with bcrypt
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password, // TODO: Hash with bcrypt in production
        role: "CUSTOMER", // Always default to "CUSTOMER" for new signups - SECURITY CRITICAL
      },
    });

    // Create response with session cookies
    const response = NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
      },
      { status: 201 }
    );

    // Set session cookies for auto-login
    response.cookies.set("sessionToken", `session_${email}_${Date.now()}`, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // authToken uses "user" for CUSTOMER role (internal mapping)
    response.cookies.set("authToken", "user", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    response.cookies.set("userEmail", email, {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Sign up error:", error);
    return NextResponse.json(
      { success: false, message: "Sign up failed" },
      { status: 500 }
    );
  }
}
