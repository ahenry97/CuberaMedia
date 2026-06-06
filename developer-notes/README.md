# Developer Notes

Use this folder to capture quick local testing issues from the floating `Dev Notes` bar that appears while running `npm run dev`.

## Pending Notes

New notes are saved into:

```text
developer-notes/pending/<timestamp-page-slug>/
```

Each pending note folder includes:

- `note.md`
- `screenshot.png`

Before changing code for a reported issue, review every pending note that relates to the change.

## Completing A Note

When a note is resolved:

1. Add a summary entry to `developer-notes/completed/completed-developer-notes.md`.
2. Include the pending note ID, root cause, files changed, verification, and commit SHA when available.
3. Remove the resolved folder from `developer-notes/pending/`.

When you ask Codex to “review developer notes,” Codex should inspect pending notes first, resolve them one by one, update the completed notes document, and remove resolved pending folders.
