import { NextRequest, NextResponse } from "next/server";

/**
 * GET: Redirects user to Facebook OAuth consent screen
 */
export async function GET(_request: NextRequest) {
  const clientId = process.env.FACEBOOK_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/facebook/callback`;

  if (!clientId) {
    return NextResponse.json(
      { success: false, message: "Facebook OAuth not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "email,public_profile",
    response_type: "code",
    auth_type: "rerequest",
  });

  return NextResponse.redirect(
    `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`
  );
}
