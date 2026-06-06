import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { updateCustomerSubscription } from "@/lib/db/store";
import type { SubscriptionStatus } from "@/lib/types";
import { assertString } from "@/lib/validation";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("developer");
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    await updateCustomerSubscription({
      customer_id: id,
      plan_name: assertString(body.plan_name, "Plan name"),
      status: (typeof body.status === "string" ? body.status : "pending") as SubscriptionStatus
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Subscription update failed." }, { status: 400 });
  }
}
