import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { createSupportRequest } from "@/lib/db/store";
import { assertString } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const profile = await requireRole("customer");
    const body = (await request.json()) as Record<string, unknown>;
    const workItem = await createSupportRequest(profile.id, assertString(body.title, "Title"), assertString(body.note, "Details"));
    return NextResponse.json({ workItem });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Support request failed." }, { status: 400 });
  }
}
