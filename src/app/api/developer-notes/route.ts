import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

interface DeveloperNotePayload {
  note?: string;
  pageUrl?: string;
  pageTitle?: string;
  viewport?: string;
  userAgent?: string;
  screenshotDataUrl?: string;
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Developer notes are only available in local development." }, { status: 403 });
  }

  try {
    const body = (await request.json()) as DeveloperNotePayload;
    const note = body.note?.trim();

    if (!note || note.length < 3) {
      return NextResponse.json({ error: "A note is required." }, { status: 400 });
    }

    const screenshot = parsePngDataUrl(body.screenshotDataUrl);
    const createdAt = new Date();
    const noteId = `${formatTimestamp(createdAt)}-${slugFromUrl(body.pageUrl ?? "page")}`;
    const relativeDirectory = path.join("developer-notes", "pending", noteId);
    const absoluteDirectory = path.join(process.cwd(), relativeDirectory);

    await fs.mkdir(absoluteDirectory, { recursive: true });
    await fs.writeFile(path.join(absoluteDirectory, "screenshot.png"), screenshot);
    await fs.writeFile(
      path.join(absoluteDirectory, "note.md"),
      renderDeveloperNote({
        id: noteId,
        note,
        createdAt: createdAt.toISOString(),
        pageUrl: body.pageUrl ?? "",
        pageTitle: body.pageTitle ?? "",
        viewport: body.viewport ?? "",
        userAgent: body.userAgent ?? ""
      })
    );

    return NextResponse.json({
      id: noteId,
      notePath: `${relativeDirectory}/note.md`,
      screenshotPath: `${relativeDirectory}/screenshot.png`
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not save developer note." }, { status: 400 });
  }
}

function parsePngDataUrl(value: string | undefined): Buffer {
  const match = value?.match(/^data:image\/png;base64,(.+)$/);
  if (!match) {
    throw new Error("A PNG screenshot is required.");
  }

  return Buffer.from(match[1], "base64");
}

function renderDeveloperNote(input: {
  id: string;
  note: string;
  createdAt: string;
  pageUrl: string;
  pageTitle: string;
  viewport: string;
  userAgent: string;
}) {
  return `# Pending Developer Note: ${input.id}

Status: pending
Created: ${input.createdAt}
Page URL: ${input.pageUrl}
Page title: ${input.pageTitle}
Viewport: ${input.viewport}
Screenshot: ./screenshot.png

## Tester Note

${input.note}

## Review Before Code Changes

- [ ] Reviewed this note and screenshot before editing files.
- [ ] Confirmed the affected route/component.
- [ ] Identified the root cause or intended quick change.

## Resolution Checklist

- [ ] Implemented the fix.
- [ ] Ran focused verification.
- [ ] Added an entry to ../completed/completed-developer-notes.md.
- [ ] Removed this pending note folder after completion.

## Technical Context

\`\`\`text
User agent: ${input.userAgent}
\`\`\`
`;
}

function formatTimestamp(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join("");
}

function slugFromUrl(rawUrl: string) {
  try {
    const url = new URL(rawUrl);
    const slug = `${url.pathname || "home"}${url.search ? `-${url.search}` : ""}`
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
    return slug || "home";
  } catch {
    return "page";
  }
}
