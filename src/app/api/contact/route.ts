import { NextResponse } from "next/server";
import { createContactMessage } from "@/lib/db/store";
import { assertEmail, assertString, parseLanguage } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const message = await createContactMessage({
      name: assertString(body.name, "Name"),
      email: assertEmail(body.email),
      phone: assertString(body.phone, "Phone"),
      business_name: assertString(body.business_name, "Business name"),
      preferred_language: parseLanguage(body.preferred_language),
      message: assertString(body.message, "Message", 5)
    });

    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Contact message failed." }, { status: 400 });
  }
}
