import { NextRequest, NextResponse } from "next/server";

/**
 * GET: Redirects user to Google OAuth consent screen
 */
export async function GET(_request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google/callback`;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: "Google OAuth not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
