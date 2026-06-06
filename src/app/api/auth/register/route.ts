import { NextResponse } from "next/server";
import { setSessionCookie } from "@/lib/auth/session";
import { registerCustomer } from "@/lib/db/store";
import { assertEmail, assertString, parseLanguage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const profile = await registerCustomer({
      full_name: assertString(body.full_name, "Full name"),
      email: assertEmail(body.email),
      password: assertString(body.password, "Password", 8),
      business_name: assertString(body.business_name, "Business name"),
      phone: assertString(body.phone, "Phone"),
      preferred_language: parseLanguage(body.preferred_language)
    });

    const response = NextResponse.json({ profile });
    setSessionCookie(response, profile);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed." }, { status: 400 });
  }
}
