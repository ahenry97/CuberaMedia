import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { createSubscriptionChangeRequest, readData } from "@/lib/db/store";
import { assertString } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const profile = await requireRole("customer");
    const body = (await request.json()) as Record<string, unknown>;
    const planName = assertString(body.plan_name, "Plan");
    const data = await readData();
    const plan = data.plans.find((item) => item.name === planName);

    if (!plan) {
      return NextResponse.json({ error: "Select a valid plan." }, { status: 400 });
    }

    const workItem = await createSubscriptionChangeRequest({
      customer_id: profile.id,
      plan_name: plan.name,
      note: typeof body.note === "string" ? body.note.trim() : "",
      requires_verification: plan.requires_verification ?? false
    });

    return NextResponse.json({ workItem });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Subscription request failed." }, { status: 400 });
  }
}
