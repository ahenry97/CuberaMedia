import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { authenticateUser } from "@/lib/db/store";
import { assertEmail, assertString } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const profile = await authenticateUser(assertEmail(body.email), assertString(body.password, "Password"));

    if (!profile) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({ profile, redirectTo: profile.role === "developer" ? "/developer" : "/dashboard" });
    setSessionCookie(response, profile);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed." }, { status: 400 });
  }
}
