import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateCustomerAccount } from "@/lib/db/store";
import type { SubscriptionStatus } from "@/lib/types";
import { assertString } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const developer = await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const developerNote = assertString(body.developer_note, "Developer note", 1);
    const profile = await updateCustomerAccount({
      customer_id: id,
      plan_name: assertString(body.plan_name, "Plan name"),
      status: (typeof body.status === "string" ? body.status : "pending") as SubscriptionStatus,
      phone: assertString(body.phone, "Phone"),
      developer_note: developerNote,
      author_id: developer.id
    });
    return NextResponse.json({ profile });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Subscription update failed." }, { status: 400 });
  }
}
