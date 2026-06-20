# Agent Guidelines — cs-portfolio

This is a Next.js portfolio site deployed to **Vercel** (production domain:
`alantom.dev`, project `cs-portfolio`, team `alantomws-projects`). Git is on
GitHub at `alanwtom/cs-portfolio`; default branch is `main`.

## Standing rules

### 1. Always verify locally before pushing to production

Never push to `main` / deploy to prod without first verifying locally:

```bash
npx tsc --noEmit      # type-check (fastest signal)
npx eslint .          # lint — do NOT use `next lint` (broken on ESLint 9 + .eslintrc.json)
npx next build        # production build
```

For client components that gate on `isLoaded` (theme/localStorage), raw `curl`
only sees the loading spinner. To verify the *rendered* output, use headless
Chrome:

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --no-sandbox \
  --dump-dom --virtual-time-budget=6000 http://localhost:3210/ > dom.html
# then grep dom.html for expected content
```

### 2. After pushing to production, clean up ALL local deployments

**This is a standing instruction.** Once a change is deployed to production
(`vercel --prod --yes`), immediately clean up:

1. **Vercel deployments** — delete every deployment EXCEPT:
   - the one aliased to `alantom.dev` (the live deploy), AND
   - the **previous** Production deployment (kept as a one-click rollback).
2. **Local build cache** — `rm -rf .next`
3. **Local dev server** — `pkill -f "next dev"; pkill -f "next-server"`

```bash
# Find the keep-set: alias + previous prod
LIVE=$(vercel inspect https://alantom.dev 2>&1 | grep -oE "cs-portfolio-[a-z0-9]+-" | head -1)
# Paginate ALL deployments (vercel ls truncates to ~20)
NEXT=""; > /tmp/all-ids.txt
while :; do
  [ -z "$NEXT" ] && OUT=$(vercel ls 2>&1) || OUT=$(vercel ls --next "$NEXT" 2>&1)
  echo "$OUT" | grep -oE "cs-portfolio-[a-z0-9]+-alantomws-projects\.vercel\.app" \
    | sed -E 's/cs-portfolio-([a-z0-9]+)-alantomws.*/\1/' >> /tmp/all-ids.txt
  NEWNEXT=$(echo "$OUT" | grep -oE "vercel ls --next [0-9]+" | grep -oE "[0-9]+")
  [ -z "$NEWNEXT" ] && break; [ "$NEWNEXT" = "$NEXT" ] && break; NEXT="$NEWNEXT"
done
sort -u /tmp/all-ids.txt | grep -vE '^(LIVE_ID|PREVIOUS_PROD_ID)$' \
  | while read id; do vercel rm "https://cs-portfolio-${id}-alantomws-projects.vercel.app" --yes; done
rm -rf .next
pkill -f "next dev" 2>/dev/null; pkill -f "next-server" 2>/dev/null
```

**Always sanity-check the keep-set is NOT in the delete list before deleting.**
Deployments are irreversible.

## Toolchain notes

- **Package manager:** `pnpm` (v11). `onlyBuiltDependencies` lives in
  **`pnpm-workspace.yaml`**, NOT `package.json`.
- **`next lint` is broken** (ESLint 9 + `.eslintrc.json` mismatch) — use
  `npx eslint .` directly.
- **OG image** must be true **1200×630** — platforms stretch mismatched
  aspect ratios. Source: `public/images/buttercup_og.png`.
- **Force-push to `main`:** avoid. Prefer append a revert commit to keep
  history honest (append-only).

## Key file map

- `portfolio.tsx` (root) — the whole single-page layout
- `app/layout.tsx` — metadata, OG/Twitter tags, Geist font, JSON-LD
- `app/globals.css` — dark/light editorial palette, a11y focus rings
- `components/` — `ProjectCard`, `ProjectModal`, `ScrollProgress`,
  `SectionHeading`, `theme-{provider,toggle}`
- `lib/constants.ts` — content (projects, experiences, social URLs)
