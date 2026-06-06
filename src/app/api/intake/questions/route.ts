import { NextResponse } from "next/server";
import { readData } from "@/lib/db/store";

export async function GET() {
  const data = await readData();
  return NextResponse.json({
    questions: data.intakeQuestions
      .filter((question) => question.active && !question.archived)
      .sort((a, b) => a.display_order - b.display_order)
  });
}
