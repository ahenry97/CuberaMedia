import { appHref, isStaticExport } from "@/lib/paths";

function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}

export async function appFetch(input: string, init?: RequestInit, staticPayload: unknown = { ok: true }) {
  if (isStaticExport && input.startsWith("/api/")) {
    return jsonResponse(staticPayload);
  }

  return fetch(appHref(input), init);
}
