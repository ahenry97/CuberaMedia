import { NextResponse } from "next/server";
import { getCurrentProfile } from "@/lib/auth/session";

export async function GET() {
  const profile = await getCurrentProfile();
  return NextResponse.json({ profile });
}
