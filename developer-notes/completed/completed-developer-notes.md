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
