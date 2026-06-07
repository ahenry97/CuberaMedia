import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { deleteOperationWorkflow, upsertOperationWorkflow } from "@/lib/db/store";
import type { SourceType, WorkItemStatus } from "@/lib/types";

export async function POST(request: Request) {
  try {
    await requireRole("developer");
    const body = (await request.json()) as Record<string, unknown>;
    const workflow = await upsertOperationWorkflow({
      id: typeof body.id === "string" && body.id ? body.id : undefined,
      name: typeof body.name === "string" ? body.name.trim() : "",
      description: typeof body.description === "string" ? body.description.trim() : "",
      source_type: (typeof body.source_type === "string" ? body.source_type : "manual") as SourceType,
      statuses: Array.isArray(body.statuses) ? (body.statuses as WorkItemStatus[]) : [],
      notification_rules: typeof body.notification_rules === "string" ? body.notification_rules.trim() : "",
      document_rules: typeof body.document_rules === "string" ? body.document_rules.trim() : "",
      active: body.active !== false
    });

    return NextResponse.json({ workflow });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Workflow update failed." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireRole("developer");
    const body = (await request.json()) as Record<string, unknown>;
    if (typeof body.id !== "string" || !body.id) {
      throw new Error("Workflow id is required.");
    }

    await deleteOperationWorkflow(body.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Workflow delete failed." }, { status: 400 });
  }
}
