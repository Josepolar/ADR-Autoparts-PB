import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

/**
 * Facebook OAuth callback handler
 * Exchanges code for tokens, gets user profile, creates/finds user, sets session
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/api/auth/facebook/callback`;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/auth/signin?error=no_code`);
  }

  try {
    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      client_id: process.env.FACEBOOK_CLIENT_ID || "",
      client_secret: process.env.FACEBOOK_CLIENT_SECRET || "",
      redirect_uri: redirectUri,
      code,
    });

    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?${tokenParams.toString()}`
    );

    if (!tokenRes.ok) {
      console.error("Facebook token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=token_failed`);
    }

    const tokenData = await tokenRes.json();

    // Get user profile from Facebook
    const profileRes = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`
    );

    if (!profileRes.ok) {
      return NextResponse.redirect(`${baseUrl}/auth/signin?error=profile_failed`);
    }

    const profile = await profileRes.json();
    const { id: fbId, name, email, picture } = profile;
    const pictureUrl = picture?.data?.url || null;

    if (!email) {
      return NextResponse.redirect(
        `${baseUrl}/auth/signin?error=fb_no_email`
      );
    }

    // Find or create user
    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      user = await db.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          provider: "facebook",
          providerId: fbId,
          image: pictureUrl,
          role: "CUSTOMER",
          isVerified: false,
          emailVerified: new Date(),
        },
      });
    } else if (!user.provider) {
      // Existing user signing in with Facebook for the first time — link account
      user = await db.user.update({
        where: { email },
        data: {
          provider: "facebook",
          providerId: fbId,
          image: pictureUrl || user.image,
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
    response.cookies.set("oauthLogin", JSON.stringify({ role: internalRole, email, name: user.name }), {
      httpOnly: false,
      sameSite: "lax",
      maxAge: 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Facebook OAuth error:", error);
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
