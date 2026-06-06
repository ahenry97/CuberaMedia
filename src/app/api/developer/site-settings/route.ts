import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateSiteSettings } from "@/lib/db/store";
import type { SiteSettings } from "@/lib/types";

export async function PATCH(request: Request) {
  try {
    await requireRole("developer");
    const body = (await request.json()) as SiteSettings;
    const settings = await updateSiteSettings(body);
    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Settings update failed." }, { status: 400 });
  }
}
