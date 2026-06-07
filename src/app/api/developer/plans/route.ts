import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { upsertPlan } from "@/lib/db/store";

export async function POST(request: Request) {
  try {
    await requireRole("developer");
    const body = (await request.json()) as Record<string, unknown>;
    const plan = await upsertPlan({
      id: typeof body.id === "string" && body.id ? body.id : undefined,
      name: typeof body.name === "string" ? body.name.trim() : "",
      monthly_price: typeof body.monthly_price === "string" ? body.monthly_price.trim() : "",
      description_en: typeof body.description_en === "string" ? body.description_en.trim() : "",
      description_es: typeof body.description_es === "string" ? body.description_es.trim() : "",
      features_en: typeof body.features_en === "string" ? body.features_en.split("\n") : [],
      features_es: typeof body.features_es === "string" ? body.features_es.split("\n") : [],
      requires_verification: body.requires_verification === true,
      notification_note_en: typeof body.notification_note_en === "string" ? body.notification_note_en.trim() : "",
      notification_note_es: typeof body.notification_note_es === "string" ? body.notification_note_es.trim() : ""
    });

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Plan update failed." }, { status: 400 });
  }
}
