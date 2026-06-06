import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { upsertIntakeQuestion } from "@/lib/db/store";
import type { QuestionType } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const question = await upsertIntakeQuestion({
      id,
      label_en: typeof body.label_en === "string" ? body.label_en : undefined,
      label_es: typeof body.label_es === "string" ? body.label_es : undefined,
      help_text_en: typeof body.help_text_en === "string" ? body.help_text_en : undefined,
      help_text_es: typeof body.help_text_es === "string" ? body.help_text_es : undefined,
      question_type: typeof body.question_type === "string" ? (body.question_type as QuestionType) : undefined,
      required: typeof body.required === "boolean" ? body.required : undefined,
      active: typeof body.active === "boolean" ? body.active : undefined,
      archived: typeof body.archived === "boolean" ? body.archived : undefined,
      display_order: typeof body.display_order === "number" ? body.display_order : undefined,
      options_json: Array.isArray(body.options_json) ? body.options_json.map(String) : undefined
    });

    return NextResponse.json({ question });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Question update failed." }, { status: 400 });
  }
}
