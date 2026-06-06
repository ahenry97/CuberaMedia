import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateProjectStatus } from "@/lib/db/store";
import type { ProjectStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    await updateProjectStatus(id, (typeof body.status === "string" ? body.status : "new") as ProjectStatus);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Project update failed." }, { status: 400 });
  }
}
