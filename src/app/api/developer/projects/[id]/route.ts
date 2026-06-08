import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateProject } from "@/lib/db/store";
import type { ProjectStatus } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const project = await updateProject({
      id,
      name: typeof body.name === "string" ? body.name : undefined,
      service_type: typeof body.service_type === "string" ? body.service_type : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      status: typeof body.status === "string" ? (body.status as ProjectStatus) : undefined
    });
    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Project update failed." }, { status: 400 });
  }
}
