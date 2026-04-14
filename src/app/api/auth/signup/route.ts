import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

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
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user with "CUSTOMER" role (default for security)
    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "CUSTOMER",
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
