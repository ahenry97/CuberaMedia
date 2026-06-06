# AGENTS.md

## Project Goal

Build and maintain a bilingual English/Spanish website and app for Cubera Digital Solutions, a digital solutions business serving local small businesses.

The app supports:

- Website creation service discovery.
- Digital business profile setup.
- Google Business Profile support.
- Social media marketing requests.
- Customer onboarding, intake forms, project tracking, and support requests.
- Developer team workflows for customers, intake questions, work items, projects, contact messages, and site settings.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Local file-backed development data store for immediate local testing.
- Supabase/PostgreSQL schema in `supabase/migrations`.
- Custom email/password auth and signed HTTP-only session cookie.
- OAuth entry routes for Google and Apple provider configuration.

## Security Rules

- Public registration must always assign `customer`.
- Never add a public account-type selector for elevated roles.
- Developer access must be assigned manually in stored data or by a trusted developer workflow.
- Customer pages must only read customer-owned records.
- Developer pages must require the `developer` role.
- Keep secrets in environment variables and never commit real credentials.
- Production changes must go through the GitHub production environment approval gate.

## Local Development

Run from the repository root:

```bash
npm install
npm run seed
npm run dev
```

Seed users:

- `customer@example.com` / `Password123!`
- `developer@example.com` / `Password123!`

## Implementation Priorities

- Keep the interface simple, responsive, and business-friendly.
- Make bilingual labels and status messages available everywhere users work.
- Prefer clear forms, tables, status badges, and dashboards over decorative effects.
- Keep the data model aligned with the Supabase/PostgreSQL schema.
- Run `npm run lint`, `npm run test`, and `npm run build` before committing.

## Developer Notes Workflow

When the user asks to review developer notes:

1. Inspect every pending folder in `developer-notes/pending/`.
2. Read `note.md` and inspect `screenshot.png` before editing files.
3. Resolve each clear issue with focused code changes.
4. Run focused verification.
5. Append the resolution to `developer-notes/completed/completed-developer-notes.md`.
6. Remove the resolved pending folder.

Do not start code changes for a captured local testing issue until the matching pending note has been reviewed.
