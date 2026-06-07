# Completed Developer Notes

Resolved local testing notes should be documented here before their pending folders are removed.

## Entry Template

```text
Date:
Pending note ID:
Issue:
Root cause:
Files changed:
Verification:
Commit:
```

## 2026-06-06

Date: 2026-06-06
Pending note ID: 20260606184710-home
Issue: Home page process section felt unprofessional, and the orange/coral accent text was too loud.
Root cause: The process block used oversized heading treatment and sparse cards, while the home eyebrow and workspace label used the coral accent.
Files changed: `src/components/public/PublicPages.tsx`, `src/lib/i18n.ts`
Verification: Reviewed the updated home page locally; the process section now uses a cleaner workflow layout and teal accents.
Commit: Resolution commit containing this entry.

Date: 2026-06-06
Pending note ID: 20260606184821-home
Issue: The home page View Services button did not navigate as expected.
Root cause: Button-style navigation used the Next `Link` component; replacing button links with plain anchors makes local browser navigation more reliable.
Files changed: `src/components/ui/Button.tsx`
Verification: Browser-tested `View Services`; it navigated from `/` to `/services`.
Commit: Resolution commit containing this entry.

Date: 2026-06-06
Pending note ID: 20260606184910-home
Issue: The home page Get Started button did not navigate as expected.
Root cause: Same button-link navigation issue as the View Services CTA.
Files changed: `src/components/ui/Button.tsx`
Verification: Browser-tested the hero `Get Started` CTA; it navigated from `/` to `/register`.
Commit: Resolution commit containing this entry.

Date: 2026-06-06
Pending note ID: 20260606185104-home
Issue: The Dev Notes button only worked on the home page.
Root cause: The primary blocker was page navigation reliability; once navigation was fixed, the globally mounted Dev Notes bar was verified on `/services`.
Files changed: `src/components/ui/Button.tsx`
Verification: Browser-tested Dev Notes on `/services`; the note modal opened successfully.
Commit: Resolution commit containing this entry.

Date: 2026-06-06
Pending note ID: 20260606185244-home
Issue: Language selection did not reliably follow across pages, and language could not be changed at any point.
Root cause: Language was stored only in local storage, so full navigations initially rendered English and relied on client hydration to catch up.
Files changed: `src/components/LanguageProvider.tsx`, `src/app/layout.tsx`, `src/lib/i18n.ts`
Verification: Browser-tested Spanish language selection on `/services`, then navigated back to `/`; Spanish rendered immediately from the cookie-backed initial language.
Commit: Resolution commit containing this entry.

Date: 2026-06-06
Pending note ID: 20260606185320-home
Issue: The Dashboard button did not navigate as expected.
Root cause: The dashboard button used the same button-link navigation helper as the affected CTAs.
Files changed: `src/components/ui/Button.tsx`
Verification: Browser-tested after login; the header dashboard link navigated to `/dashboard`.
Commit: Resolution commit containing this entry.

## 2026-06-07

Date: 2026-06-07
Pending note ID: 20260606191801-dashboard
Issue: Logged-in Home/header behavior sent users back to the public site and login/register pages stayed available after authentication.
Root cause: The global header and dashboard shell always rendered public navigation, and auth pages did not redirect existing sessions.
Files changed: `src/components/site/Header.tsx`, `src/components/dashboard/DashboardShell.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`
Verification: `npm run test`, `npm run lint`, `npm run build`; signed-session local route check confirmed `/login` redirects to `/dashboard`.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607122702-dashboard-subscription
Issue: Upgrade/change plan was inert and subscription changes were not reviewed by developers.
Root cause: The subscription CTA had no destination or API workflow.
Files changed: `src/components/customer/CustomerDashboard.tsx`, `src/app/dashboard/subscription/manage/page.tsx`, `src/app/api/subscription/change/route.ts`, `src/lib/db/store.ts`
Verification: Local route check confirmed `/dashboard/subscription/manage` renders plan management and request content.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607122855-dashboard-projects
Issue: Project View details buttons did not open a project dashboard.
Root cause: Project actions were plain buttons without routes.
Files changed: `src/components/customer/CustomerDashboard.tsx`, `src/app/dashboard/projects/[id]/page.tsx`
Verification: Local route check confirmed `/dashboard/projects/project-1` renders project workflow and metrics placeholders.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607122941-dashboard-intake
Issue: Intake needed multiple service selection plus a free-text service option.
Root cause: The seeded service question and UI only handled one service value.
Files changed: `src/components/customer/CustomerDashboard.tsx`, `src/lib/db/seed.ts`
Verification: Local route check confirmed the intake page renders multi-service options and the free-text service field.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607123043-dashboard-intake
Issue: Intake submission failed and the website question needed conditional URL validation.
Root cause: The final seeded question was a URL field rather than a boolean-driven conditional field.
Files changed: `src/components/customer/CustomerDashboard.tsx`, `src/app/api/intake/submit/route.ts`, `src/lib/types.ts`, `src/lib/db/seed.ts`
Verification: `npm run build`; local route check confirmed the conditional website question renders.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607123530-dashboard-support
Issue: Support requests needed categories and customer-visible tracking.
Root cause: Support requests only collected title/details and did not render existing support work items for customers.
Files changed: `src/components/customer/CustomerDashboard.tsx`, `src/app/dashboard/support/page.tsx`, `src/app/api/support/route.ts`, `src/lib/db/store.ts`, `src/lib/types.ts`
Verification: Local route check confirmed support categories and request tracking render.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607123711-dashboard-profile
Issue: Profile needed active project shortcuts and report/document placeholders.
Root cause: The profile page only exposed basic account fields.
Files changed: `src/components/customer/CustomerDashboard.tsx`, `src/app/dashboard/profile/page.tsx`
Verification: Local route check confirmed active project links and sample report placeholder render.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607123834-dashboard
Issue: Customer overview cards and recent updates were not clickable.
Root cause: Overview metrics were static cards and recent updates rendered as inert text.
Files changed: `src/components/customer/CustomerDashboard.tsx`
Verification: Local route check confirmed linked overview content and support request summary render.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607124222-developer
Issue: Developer overview summary items were not links.
Root cause: Developer metrics and activity used static card/text markup.
Files changed: `src/components/developer/DeveloperDashboard.tsx`
Verification: Local route check confirmed developer overview renders linked operational metrics.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607124551-developer-customers
Issue: Customer details needed editable phone/subscription controls, plan dropdowns, project links, and required developer notes.
Root cause: Customer rows used shallow subscription inputs and the detail action was a placeholder.
Files changed: `src/components/developer/DeveloperDashboard.tsx`, `src/app/developer/customers/page.tsx`, `src/app/api/developer/customers/[id]/subscription/route.ts`, `src/app/api/developer/plans/route.ts`, `src/lib/db/store.ts`
Verification: Local route check confirmed customer detail and required account notification note UI render.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607124929-developer-work-items
Issue: Work items needed filters, no archive button, staged workflow progression, and notification/document placeholders.
Root cause: Work item management only exposed direct status edits and archive action.
Files changed: `src/components/developer/DeveloperDashboard.tsx`, `src/lib/types.ts`, `src/lib/i18n.ts`
Verification: Local route check confirmed filters, stage button, workflow notices, and document placeholders render.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607125259-developer-intake-manager
Issue: Intake Manager needed to become Developer Manager with workflow setup, conditional intake rules, and searchable question editing.
Root cause: The manager page only handled intake question CRUD and had no workflow or plan management areas.
Files changed: `src/components/developer/DeveloperDashboard.tsx`, `src/app/developer/intake-manager/page.tsx`, `src/app/api/developer/plans/route.ts`, `src/lib/i18n.ts`
Verification: Local route check confirmed Developer Manager, workflow configuration, conditional rules, search/filter controls, and plan catalog render.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607160743-developer-intake-manager
Issue: Developer Manager needed create, edit, and delete controls for operation workflows and subscription plan catalogs.
Root cause: Workflow configuration was rendered as a static badge list, and plan catalog cards only supported add/edit.
Files changed: `src/components/developer/DeveloperDashboard.tsx`, `src/app/api/developer/workflows/route.ts`, `src/app/api/developer/plans/route.ts`, `src/lib/types.ts`, `src/lib/db/store.ts`, `src/lib/db/seed.ts`
Verification: `npm run test`, `npm run lint`, `npm run build`, and `npm run build:github-pages`.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607160951-developer-customers
Issue: Customer View details and project count links did not open a customer-specific account/project view.
Root cause: The Customers page only updated an in-page selected customer panel and linked project counts to the generic projects page.
Files changed: `src/components/developer/DeveloperDashboard.tsx`, `src/app/developer/customers/[id]/page.tsx`
Verification: `npm run build` confirmed `/developer/customers/profile-customer-1` is generated; static export also includes the route.
Commit: Resolution commit containing this entry.

Date: 2026-06-07
Pending note ID: 20260607161056-developer-customers
Issue: Selecting a customer name should open a customer account page where information can be viewed and managed.
Root cause: Customer names were buttons that only changed local component state.
Files changed: `src/components/developer/DeveloperDashboard.tsx`, `src/app/developer/customers/[id]/page.tsx`
Verification: `npm run build` and `npm run build:github-pages` generated the customer account route.
Commit: Resolution commit containing this entry.
