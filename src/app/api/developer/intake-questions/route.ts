import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { upsertIntakeQuestion } from "@/lib/db/store";
import type { QuestionType } from "@/lib/types";
import { assertString } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    await requireRole("developer");
    const body = (await request.json()) as Record<string, unknown>;
    const question = await upsertIntakeQuestion({
      id: typeof body.id === "string" ? body.id : undefined,
      label_en: assertString(body.label_en, "English label"),
      label_es: assertString(body.label_es, "Spanish label"),
      help_text_en: typeof body.help_text_en === "string" ? body.help_text_en : "",
      help_text_es: typeof body.help_text_es === "string" ? body.help_text_es : "",
      question_type: (typeof body.question_type === "string" ? body.question_type : "short_text") as QuestionType,
      required: Boolean(body.required),
      active: body.active !== false,
      archived: Boolean(body.archived),
      options_json: Array.isArray(body.options_json) ? body.options_json.map(String) : []
    });

    return NextResponse.json({ question });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Question save failed." }, { status: 400 });
  }
}
