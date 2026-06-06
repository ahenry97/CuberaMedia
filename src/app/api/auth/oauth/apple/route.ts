import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.APPLE_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!clientId) {
    return NextResponse.redirect(new URL("/login?notice=oauth-not-configured&provider=apple", appUrl));
  }

  const url = new URL("https://appleid.apple.com/auth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${appUrl}/api/auth/oauth/apple/callback`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "name email");
  return NextResponse.redirect(url);
}
