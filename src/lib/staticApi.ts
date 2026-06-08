import { appHref, isStaticExport } from "@/lib/paths";
import type { ContactMessage } from "@/lib/types";

const staticContactMessagesKey = "cubera_static_contact_messages";

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readStaticContactMessages(): ContactMessage[] {
  if (!canUseBrowserStorage()) return [];

  try {
    const raw = window.localStorage.getItem(staticContactMessagesKey);
    return raw ? (JSON.parse(raw) as ContactMessage[]) : [];
  } catch {
    window.localStorage.removeItem(staticContactMessagesKey);
    return [];
  }
}

function writeStaticContactMessages(messages: ContactMessage[]) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(staticContactMessagesKey, JSON.stringify(messages));
  window.dispatchEvent(new Event("cubera-static-data-change"));
}

function parseBody(init?: RequestInit): Record<string, unknown> {
  if (typeof init?.body !== "string") return {};

  try {
    return JSON.parse(init.body) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function appFetch(input: string, init?: RequestInit, staticPayload: unknown = { ok: true }) {
  if (isStaticExport && input.startsWith("/api/")) {
    const method = init?.method?.toUpperCase() ?? "GET";

    if (input === "/api/contact" && method === "POST") {
      const body = parseBody(init);
      const message: ContactMessage = {
        id: `contact-static-${Date.now()}`,
        name: String(body.name ?? ""),
        email: String(body.email ?? ""),
        phone: String(body.phone ?? ""),
        business_name: String(body.business_name ?? ""),
        preferred_language: String(body.preferred_language ?? "en") === "es" ? "es" : "en",
        message: String(body.message ?? ""),
        status: "new",
        created_at: new Date().toISOString()
      };
      writeStaticContactMessages([message, ...readStaticContactMessages()]);
      return jsonResponse({ message });
    }

    if (input === "/api/developer/contact-messages" && method === "GET") {
      return jsonResponse({ messages: readStaticContactMessages() });
    }

    if (input.startsWith("/api/developer/contact-messages/") && method === "PATCH") {
      const messageId = input.split("/").pop();
      const body = parseBody(init);
      const messages = readStaticContactMessages().map((message) =>
        message.id === messageId ? { ...message, status: String(body.status ?? message.status) as ContactMessage["status"] } : message
      );
      writeStaticContactMessages(messages);
      return jsonResponse({ message: messages.find((message) => message.id === messageId) ?? null });
    }

    return jsonResponse(staticPayload);
  }

  return fetch(appHref(input), init);
}
