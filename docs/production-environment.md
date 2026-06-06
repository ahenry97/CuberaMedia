# Production Environment Setup

Use this checklist before hosting the site live. The goal is to keep local testing backed up in GitHub while making production changes require explicit approval.

## 1. Create Or Connect The GitHub Repository

1. Create a GitHub repository for this project.
2. Add it as the remote for this local repo:

```sh
git remote add origin git@github.com:OWNER/REPOSITORY.git
```

3. Commit the project structure.
4. Create and push the development branch:

```sh
git checkout -b develop
git push -u origin develop
```

5. Push the production branch:

```sh
git checkout main
git push -u origin main
```

## 2. Configure The Branch Strategy

- Use `develop` for local testing and backed-up development work.
- Use feature branches for active changes, for example `feature/homepage`.
- Merge feature branches into `develop` after local testing.
- Merge `develop` into `main` only through a pull request when production is ready.
- Do not force-push `main`.

## 3. Configure GitHub Branch Protection

In GitHub, go to `Settings > Branches > Branch protection rules`.

Create a rule for `main`:

- Require pull request before merging.
- Require at least one approval.
- Require review from Code Owners after `.github/CODEOWNERS` is updated.
- Require status checks to pass before merging.
- Restrict who can push to matching branches.
- Do not allow force pushes.
- Do not allow deletions.

Create a lighter rule for `develop`:

- Require status checks to pass before merging.
- Do not allow force pushes.
- Do not allow deletions.

## 4. Configure The Production Environment Approval Gate

In GitHub, go to `Settings > Environments > New environment`.

Create an environment named exactly:

```text
production
```

Then configure:

- Required reviewers: add the GitHub account that must approve production changes.
- Deployment branches: allow only `main`.
- Optional wait timer: add one if you want a delay before production deploys can begin.

The workflow in `.github/workflows/production-migration.yml` will pause at this environment until the required reviewer approves it.

## 5. Configure Email Notification Secrets

In GitHub, go to `Settings > Secrets and variables > Actions`.

Add repository secrets:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `SMTP_FROM`

Add repository variables:

- `PRODUCTION_URL` - the live site URL.
- `SMTP_USE_TLS` - usually `true`.

The workflow sends production migration notifications to `aaronhenry0512@gmail.com`.

## 6. Connect A Hosting Provider

Use any host that can deploy from GitHub, such as GitHub Pages, Vercel, Netlify, Cloudflare Pages, or a VPS.

Recommended settings:

- Production branch: `main`.
- Development branch: `develop`.
- Project root: `website` unless the future framework requires a different root.
- Production deploy command: add it to `.github/workflows/production-migration.yml`.

Do not enable automatic production deploys that bypass GitHub environment approval. The production workflow should be the path that deploys live changes.

## 7. Confirm The Code Owner

`.github/CODEOWNERS` currently assigns repository-wide ownership to:

```text
@ahenry97
```

Update that file if another GitHub account should approve production changes.
