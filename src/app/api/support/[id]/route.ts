import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateCustomerSupportRequest } from "@/lib/db/store";
import { assertString } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const profile = await requireRole("customer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const workItem = await updateCustomerSupportRequest({
      customer_id: profile.id,
      id,
      title: assertString(body.title, "Title"),
      note: typeof body.note === "string" ? body.note : ""
    });

    if (!workItem) {
      return NextResponse.json({ error: "Support request was not found or cannot be edited." }, { status: 404 });
    }

    return NextResponse.json({ workItem });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Support request update failed." }, { status: 400 });
  }
}
