import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateContactMessageStatus } from "@/lib/db/store";
import type { ContactMessage } from "@/lib/types";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const message = await updateContactMessageStatus(id, (typeof body.status === "string" ? body.status : "reviewing") as ContactMessage["status"]);
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message update failed." }, { status: 400 });
  }
}
