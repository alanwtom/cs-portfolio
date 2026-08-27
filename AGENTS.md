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
#!/bin/bash
# Self-contained cleanup. Resolves BOTH keep-set IDs programmatically and
# ABORTS if either cannot be determined — never substitute them by hand.
PROJECT="cs-portfolio"; DOMAIN="alantom.dev"
URL_RE="${PROJECT}-[a-z0-9]+-[a-z0-9-]*\.vercel\.app"
to_id() { sed -E "s/${PROJECT}-([a-z0-9]+)-.*/\1/"; }

# 1) LIVE deployment = whatever alantom.dev currently aliases to
LIVE_ID=$(vercel inspect "https://${DOMAIN}" 2>&1 | grep -oE "$URL_RE" | head -1 | to_id)
[ -n "$LIVE_ID" ] || { echo "ABORT: could not resolve LIVE deployment from ${DOMAIN}"; exit 1; }

# 2) Paginate ALL deployments (vercel ls truncates to ~20), tracking Production rows
NEXT=""; : > /tmp/all-ids.txt; : > /tmp/prod-ids.txt
while :; do
  OUT=$(vercel ls ${NEXT:+--next "$NEXT"} 2>&1)
  echo "$OUT" | grep -oE "^.*${URL_RE}.*$" | while read -r row; do
    id=$(echo "$row" | grep -oE "$URL_RE" | head -1 | to_id)
    echo "$id" >> /tmp/all-ids.txt
    echo "$row" | grep -qiw production && echo "$id" >> /tmp/prod-ids.txt
  done
  NEWNEXT=$(echo "$OUT" | grep -oE -- "--next [0-9]+" | grep -oE "[0-9]+" | tail -1)
  [ -z "$NEWNEXT" ] && break
  [ "$NEWNEXT" = "$NEXT" ] && break
  NEXT="$NEWNEXT"
done

# 3) PREVIOUS prod = second-newest Production deployment (first is usually LIVE itself;
#    fall through the list until we find a Production ID that differs from LIVE)
PREVIOUS_PROD_ID=""
for id in $(cat /tmp/prod-ids.txt); do
  if [ "$id" != "$LIVE_ID" ]; then PREVIOUS_PROD_ID="$id"; break; fi
done
[ -n "$PREVIOUS_PROD_ID" ] || { echo "ABORT: could not resolve PREVIOUS PROD deployment"; exit 1; }
if [ "$PREVIOUS_PROD_ID" = "$LIVE_ID" ]; then
  echo "ABORT: keep-set collapsed to a single deployment — refusing to delete anything"; exit 1
fi

# 4) Final sanity check, then delete everything NOT in the keep-set
echo "KEEP: $LIVE_ID (live), $PREVIOUS_PROD_ID (previous prod)"
grep -vxF -e "$LIVE_ID" -e "$PREVIOUS_PROD_ID" /tmp/all-ids.txt | sort -u > /tmp/delete-ids.txt
[ -s /tmp/delete-ids.txt ] || { echo "Nothing to delete."; }
while read id; do vercel rm "https://cs-portfolio-${id}-alantomws-projects.vercel.app" --yes; done < /tmp/delete-ids.txt

rm -rf .next
pkill -f "next dev" 2>/dev/null; pkill -f "next-server" 2>/dev/null
```

**Guarantees:** both keep-set IDs are resolved programmatically or the script
exits without deleting anything; the keep-set is echoed before any deletion.
Deployments are irreversible — never bypass these abort checks.

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
