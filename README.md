# Cubera Website

This repository is prepared for a two-environment website workflow:

- `develop` is the local testing and development branch.
- `main` is the production branch.
- Production deploys must run through the GitHub `production` environment approval gate before anything is deployed live.
- Successful production migrations/deploys send an email notification to `aaronhenry0512@gmail.com` after SMTP secrets are configured.

## Directory Map

- `.github/workflows/` - GitHub Actions workflows for local testing snapshots and production migrations.
- `docs/` - setup, migration, and rollback documentation.
- `environments/local/` - local development environment notes and sample env file.
- `environments/production/` - production environment notes and sample env file.
- `migrations/` - migration records and templates.
- `scripts/` - automation helpers used by workflows.
- `website/` - website source and public assets.

## Local Testing

After website files are added, serve the local website from the `website` directory:

```sh
python3 -m http.server 5173 --directory website
```

Then open `http://localhost:5173`.

## Required GitHub Setup

Follow [docs/production-environment.md](docs/production-environment.md) before enabling production hosting.

Use [docs/migrations-and-reverts.md](docs/migrations-and-reverts.md) for production migration, email notification, and rollback procedures.
