# Migrations And Reverts

This project treats a production migration as any change that moves the live site forward: website code, production configuration, hosting commands, or future database/schema changes.

## Migration Folders

- `migrations/templates/` stores reusable migration templates.
- `migrations/local/` stores local testing notes when a change needs a rehearsal record.
- `migrations/production/` stores production migration records.

Use this filename pattern for production records:

```text
YYYYMMDDHHMM-short-description.md
```

Example:

```text
migrations/production/202606061630-initial-production-site.md
```

## Standard Migration Flow

1. Create a feature branch from `develop`.
2. Make and test the local change.
3. Push the feature branch to GitHub so the work is backed up.
4. Open a pull request into `develop`.
5. After testing, merge into `develop`.
6. Create a production migration record in `migrations/production/`.
7. Open a pull request from `develop` into `main`.
8. Get the required production approval.
9. Merge into `main`.
10. Let the `Production migration` workflow wait for the GitHub `production` environment approval.
11. Approve the workflow only when the change is ready to go live.
12. Verify the live site after the workflow completes.

The workflow sends an email to `aaronhenry0512@gmail.com` after the production migration finishes successfully.

## What A Migration Record Should Include

Use `migrations/templates/production-migration-template.md`.

Every production migration should include:

- Owner.
- Summary.
- Related branch or pull request.
- Files or systems changed.
- Preflight checks.
- Approval notes.
- Deployment or migration steps.
- Verification steps.
- Rollback plan.

## Reverting A Local Testing Change

Use this when the change has only reached `develop` or a feature branch.

```sh
git checkout develop
git pull
git revert COMMIT_SHA
git push origin develop
```

If the change is still on a feature branch, revert it there and push the branch again.

## Reverting A Production Change

Use `git revert`; do not rewrite `main` history.

```sh
git checkout main
git pull
git checkout -b hotfix/revert-short-description
git revert COMMIT_OR_MERGE_SHA
git push -u origin hotfix/revert-short-description
```

Then:

1. Open a pull request from the hotfix branch into `main`.
2. Request the required production approval.
3. Merge the hotfix pull request.
4. Approve the `production` environment workflow.
5. Confirm the production email notification is sent.
6. Verify the live site.

## Emergency Host Rollback

If the hosting provider supports deployment rollback, use it only to restore service quickly. After the site is stable, still create a Git revert so GitHub history matches production.

Document the emergency rollback in a new production migration record.

## Finding The Change To Revert

Use one of these sources:

- The production migration record in `migrations/production/`.
- The GitHub Actions run linked in the production email.
- The merge commit on `main`.
- The hosting provider deployment log.

Keep the production workflow run URL and commit SHA in each migration record.
