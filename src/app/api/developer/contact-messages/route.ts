import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/session";
import { readData } from "@/lib/db/store";

export async function GET() {
  await requireRole("developer");
  const data = await readData();
  return NextResponse.json({ messages: data.contactMessages });
}
