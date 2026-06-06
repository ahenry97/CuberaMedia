import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateWorkItem } from "@/lib/db/store";
import type { WorkItemPriority, WorkItemStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const profile = await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const workItem = await updateWorkItem({
      id,
      status: typeof body.status === "string" ? (body.status as WorkItemStatus) : undefined,
      priority: typeof body.priority === "string" ? (body.priority as WorkItemPriority) : undefined,
      project_id: typeof body.project_id === "string" ? body.project_id || null : undefined,
      assigned_to: typeof body.assigned_to === "string" ? body.assigned_to || null : undefined,
      archived: typeof body.archived === "boolean" ? body.archived : undefined,
      note: typeof body.note === "string" ? body.note : undefined,
      author_id: profile.id
    });

    return NextResponse.json({ workItem });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Work item update failed." }, { status: 400 });
  }
}
