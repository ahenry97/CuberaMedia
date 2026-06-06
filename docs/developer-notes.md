# Local Developer Notes Workflow

The app includes a local-only floating `Dev Notes` bar during `npm run dev`.

Use it when testing locally to capture a page screenshot and a short issue note. The app writes the captured note into `developer-notes/pending/`.

## Capture An Issue

1. Run the app locally:

```bash
npm run dev
```

2. Open the page you are testing.
3. Click `Dev Notes`.
4. Describe the issue, expected behavior, and relevant clicks or inputs.
5. Click `Capture page issue`.

The generated folder includes:

- `note.md`
- `screenshot.png`

## Review Rule

Before making code changes for local testing feedback, review matching pending notes in:

```text
developer-notes/pending/
```

The note itself includes a review checklist and resolution checklist.

## Resolve A Note

When the issue is fixed:

1. Add an entry to `developer-notes/completed/completed-developer-notes.md`.
2. Include the pending note ID, root cause, files changed, verification, and commit SHA if available.
3. Remove the resolved pending note folder.
4. Commit the code change and completed-note update together.

## Codex Review Command

When you ask Codex to “review developer notes,” Codex should:

1. Read all folders in `developer-notes/pending/`.
2. Inspect each `note.md` and `screenshot.png`.
3. Fix the issue when it is clear.
4. Verify the fix.
5. Document the resolution in `developer-notes/completed/completed-developer-notes.md`.
6. Remove the resolved pending folder.
