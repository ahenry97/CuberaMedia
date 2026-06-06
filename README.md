# Cubera Digital Solutions

Simple digital solutions for local businesses.

This is a bilingual English/Spanish Next.js app for a small-business digital services workflow. It includes public service pages, registration/login, customer dashboards, dynamic intake forms, developer dashboards, contact message handling, work item tracking, and production migration documentation.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local file-backed data store for development
- Supabase/PostgreSQL schema and RLS policies in `supabase/migrations`
- Custom email/password auth with signed HTTP-only session cookies
- Google and Apple OAuth entry routes ready for provider credentials

## Install

```bash
npm install
```

## Environment

Copy `.env.example` into `.env.local` and update values:

```bash
cp .env.example .env.local
```

Important variables:

- `AUTH_SECRET` signs local session cookies.
- `LOCAL_DATA_FILE` controls the local development data file.
- `NEXT_PUBLIC_APP_URL` is used by OAuth redirect routes.
- `GOOGLE_CLIENT_ID` and `APPLE_CLIENT_ID` enable provider redirects.
- Supabase variables are included for future production database wiring.

## Run Locally

```bash
npm run seed
npm run dev
```

Open `http://localhost:3000`.

Seed accounts:

- Customer: `customer@example.com` / `Password123!`
- Developer: `developer@example.com` / `Password123!`

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run test
npm run seed
```

## Roles

Public registration always creates a `customer` profile. Users cannot self-register as `developer`.

Customer users can:

- View their dashboard.
- View subscription and projects.
- Submit dynamic intake forms.
- Create support requests.
- Update basic profile information.

Developer users can:

- View all customers.
- View and update work items.
- Read intake submissions and answers.
- Create, edit, reorder, activate, deactivate, and archive intake questions.
- Update subscriptions and project statuses.
- View contact form submissions.
- Update site settings placeholders.

## Promote A User To Developer

Local development data is stored at `.local-data/app-data.json` after seeding or first app access.

To promote a user locally, edit that file and change the matching profile:

```json
"role": "developer"
```

In Supabase/PostgreSQL, promote a trusted user manually:

```sql
update public.profiles
set role = 'developer'
where email = 'trusted-user@example.com';
```

Do this only from a trusted database console or by an existing developer/admin workflow.

## Database

The Supabase/PostgreSQL schema lives in:

```text
supabase/migrations/202606060001_initial_schema.sql
```

Seed SQL for configurable site data and intake questions lives in:

```text
supabase/seed.sql
```

The initial app uses the local file-backed data store so it can run immediately without external services. The schema keeps the model ready for Supabase production wiring.

## Production Environment

Follow [docs/production-environment.md](docs/production-environment.md) before enabling live hosting.

Production deploys must use the GitHub `production` environment approval gate. Successful production migrations send an email to `aaronhenry0512@gmail.com` after SMTP secrets are configured.

Migration and rollback steps are documented in [docs/migrations-and-reverts.md](docs/migrations-and-reverts.md).
