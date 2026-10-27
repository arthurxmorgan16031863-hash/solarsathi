# Deploying Solar Sathi

**Vercel:** import the repo (framework: Vite). `vercel.json` is already set. No env vars needed.

**GitHub Pages:** push to `main`, then Settings > Pages > Source: *GitHub Actions*.
`.github/workflows/deploy.yml` runs `npm run build:pages` (relative base, works under any repo path).

**Manual:** `npm run build` (root hosting) or `npm run build:pages` (sub-path hosting), then upload `dist/`.
