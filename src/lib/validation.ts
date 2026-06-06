import type { Language } from "@/lib/types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function assertString(value: unknown, field: string, minLength = 1): string {
  if (typeof value !== "string" || value.trim().length < minLength) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

export function assertEmail(value: unknown): string {
  const email = assertString(value, "Email").toLowerCase();
  if (!emailPattern.test(email)) {
    throw new Error("Enter a valid email address.");
  }
  return email;
}

export function parseLanguage(value: unknown): Language {
  return value === "es" ? "es" : "en";
}
