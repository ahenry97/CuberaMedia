import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { updateProfile } from "@/lib/db/store";
import { assertString, parseLanguage } from "@/lib/validation";

export async function PATCH(request: Request) {
  try {
    const profile = await requireAuth();
    const body = (await request.json()) as Record<string, unknown>;
    const updated = await updateProfile(profile.id, {
      full_name: assertString(body.full_name, "Full name"),
      phone: assertString(body.phone, "Phone"),
      business_name: assertString(body.business_name, "Business name"),
      preferred_language: parseLanguage(body.preferred_language)
    });
    return NextResponse.json({ profile: updated });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Profile update failed." }, { status: 400 });
  }
}
