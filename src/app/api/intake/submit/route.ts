import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { readData, submitIntake } from "@/lib/db/store";
import type { IntakeAnswerValue } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const profile = await requireRole("customer");
    const body = (await request.json()) as { answers?: Record<string, IntakeAnswerValue> };
    const data = await readData();
    const questions = data.intakeQuestions.filter((question) => question.active && !question.archived);

    for (const question of questions) {
      const answer = body.answers?.[question.id];
      if (question.required && (answer === undefined || answer === "" || (Array.isArray(answer) && answer.length === 0))) {
        return NextResponse.json({ error: `${question.label_en} is required.` }, { status: 400 });
      }
    }

    const websiteAnswer = body.answers?.["question-3"];
    if (
      websiteAnswer &&
      typeof websiteAnswer === "object" &&
      !Array.isArray(websiteAnswer) &&
      websiteAnswer.hasWebsite === true
    ) {
      const url = typeof websiteAnswer.url === "string" ? websiteAnswer.url.trim() : "";
      try {
        new URL(url);
      } catch {
        return NextResponse.json({ error: "Website URL is required when you already have a website." }, { status: 400 });
      }
    }

    const submission = await submitIntake(profile.id, body.answers ?? {});
    return NextResponse.json({ submission });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Intake submission failed." }, { status: 400 });
  }
}
