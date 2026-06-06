# Local Environment

Use this directory for local development notes and non-secret configuration examples.

Recommended workflow:

1. Work from `develop` or a feature branch.
2. Serve the website locally from the repository root:

```sh
python3 -m http.server 5173 --directory website
```

3. Test at `http://localhost:5173`.
4. Push feature branches to GitHub regularly so local testing work is backed up.

Never store private secrets in this directory.
