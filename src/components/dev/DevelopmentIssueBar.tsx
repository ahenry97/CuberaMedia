"use client";

import { Bug, Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

type SaveState = "idle" | "capturing" | "saving" | "saved" | "error";

export function DevelopmentIssueBar() {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [savedPath, setSavedPath] = useState("");

  const captureIssue = async () => {
    if (!note.trim()) {
      setSaveState("error");
      return;
    }

    setSaveState("capturing");
    await waitForPaint();

    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(document.documentElement, {
      backgroundColor: "#f8fafc",
      logging: false,
      useCORS: true,
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
      ignoreElements: (element) => element.hasAttribute("data-dev-note-bar")
    });

    setSaveState("saving");
    const response = await fetch("/api/developer-notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        note: note.trim(),
        pageUrl: window.location.href,
        pageTitle: document.title,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        screenshotDataUrl: canvas.toDataURL("image/png")
      })
    });

    if (!response.ok) {
      setSaveState("error");
      return;
    }

    const payload = (await response.json()) as { notePath: string };
    setSavedPath(payload.notePath);
    setNote("");
    setSaveState("saved");
  };

  return (
    <div data-dev-note-bar className="fixed bottom-4 right-4 z-[90] max-w-[calc(100vw-2rem)]">
      {open ? (
        <div className="w-[min(390px,calc(100vw-2rem))] rounded-md border border-ink/15 bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-white">
                <Bug size={18} />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Development note</p>
                <p className="text-xs text-slate">Saved under developer-notes/pending</p>
              </div>
            </div>
            <button
              type="button"
              className="grid h-9 w-9 place-items-center rounded-md text-slate hover:bg-paper"
              onClick={() => setOpen(false)}
              aria-label="Close development note panel"
            >
              <X size={18} />
            </button>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-ink">
            Issue note
            <textarea
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                if (saveState !== "idle") setSaveState("idle");
              }}
              className="min-h-28 w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
              placeholder="Describe the issue, expected behavior, and anything you clicked."
            />
          </label>

          <Button type="button" className="mt-3 w-full" onClick={captureIssue} disabled={saveState === "capturing" || saveState === "saving"}>
            {saveState === "capturing" || saveState === "saving" ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
            {saveState === "capturing" ? "Taking screenshot" : saveState === "saving" ? "Saving note" : "Capture page issue"}
          </Button>

          {saveState === "saved" ? (
            <p className="mt-3 flex items-start gap-2 rounded-md bg-emerald-50 p-3 text-xs font-semibold leading-5 text-emerald-800">
              <CheckCircle2 className="mt-0.5 shrink-0" size={15} />
              Saved: {savedPath}
            </p>
          ) : null}
          {saveState === "error" ? (
            <p className="mt-3 rounded-md bg-red-50 p-3 text-xs font-semibold leading-5 text-red-700">
              Add a note and try again. Developer notes only save while running locally in development mode.
            </p>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-bold text-white shadow-2xl transition hover:bg-blue-600"
          onClick={() => setOpen(true)}
        >
          <Bug size={17} />
          Dev Notes
        </button>
      )}
    </div>
  );
}

function waitForPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  });
}
