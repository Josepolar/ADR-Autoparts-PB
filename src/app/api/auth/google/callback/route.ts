import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

/**
 * Google OAuth callback handler
 * Exchanges code for tokens, gets user profile, creates/finds user, sets session
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("Google token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=token_failed`);
    }

    const tokenData = await tokenRes.json();

    // Get user profile from Google
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!profileRes.ok) {
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=profile_failed`);
    }

    const profile = await profileRes.json();
    const { email, name, picture, id: googleId } = profile;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=no_email`);
    }

    // Find or create user
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          provider: "google",
          providerId: googleId,
          image: picture || null,
          role: "CUSTOMER",
          isVerified: false,
          emailVerified: new Date(),
        },
      });
    } else if (!user.provider) {
      // Existing user signing in with Google for the first time — link account
      user = await db.user.update({
        where: { email },
        data: {
          provider: "google",
          providerId: googleId,
          image: picture || user.image,
          emailVerified: user.emailVerified || new Date(),
        },
      });
    }

    // Map DB role to internal role string
    const roleMap: Record<string, string> = {
      ADMIN: "admin",
      MECHANIC: "staff",
      CUSTOMER: "user",
    };
    const internalRole = roleMap[user.role] || "user";

    // Set session cookies
    const response = NextResponse.redirect(`${baseUrl}${getRedirectPath(internalRole)}`);

    response.cookies.set("sessionToken", `session_${email}_${Date.now()}`, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    response.cookies.set("authToken", internalRole, {
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
    // Pass auth data for client-side sessionStorage pick-up
    response.cookies.set("oauthLogin", JSON.stringify({ role: internalRole, email, name: user.name }), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60, // short-lived, just for client pickup
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=oauth_failed`);
  }
}

function getRedirectPath(role: string): string {
  switch (role) {
    case "admin": return "/admin";
    case "staff": return "/staff";
    default: return "/";
  }
}
