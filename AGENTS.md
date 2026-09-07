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

## The design system (read before building any new component)

Every component on this site follows three constraints. They are enforced by
tokens in `app/globals.css` and `tailwind.config.ts`, not by taste. Follow
them and a new component will look like it belongs without anyone
art-directing it.

### 1. An 8px base grid

Every gap, padding and line-height is a multiple of 8. Tailwind's scale is
4px-based, so **only its even steps are legal**: `2`=8, `4`=16, `6`=24,
`8`=32, `10`=40, `12`=48, `16`=64, `20`=80, `24`=96.

Never use `p-3` (12), `gap-5` (20), `mt-1.5` (6) or `py-0.5` (2). If an
element needs to sit off-grid to look right, change its *box size* to a grid
multiple instead of nudging it with a margin — e.g. an icon next to a 24px
line of text should be a 24px box (`h-6 w-6`), not a 16px box with `mt-0.5`.

### 2. Three radii, derived from one

| token | value | use |
|---|---|---|
| `rounded-lg` | 24px | outer surfaces — cards, rows, modal, the hero photo |
| `rounded-md` | 16px | surfaces nested 8px inside a 24px parent (24 − 8) |
| `rounded-sm` | 8px  | controls — buttons, inputs, tags, focus rings |

Safe space inside a 24px surface is `p-inset` (24px), or `p-inset-sm` (16px)
for nested ones. That's why 24px shows up as both the radius and the padding:
content never crowds the curve.

### 3. One family, three sizes and three weights per component

Geist throughout, at weights 400 and 500 only. Hierarchy comes from size and
weight, never from a second typeface — a Baskerville serif was tried for the
display type and rejected as far too formal for this site. Don't reintroduce
one without asking.

**Do not write `text-lg` or `font-semibold` in a component.** Pick a step from
the ramp in `globals.css`:

| class | size / line-height | weight |
|---|---|---|
| `type-display` | 40/48 → 48/56 | 500 |
| `type-title` | 24/32 | 500 |
| `type-heading` | 18/24 | 500 |
| `type-body` / `type-body-strong` | 16/24 | 400 / 500 |
| `type-accent` | 16/24 italic | 400 |
| `type-meta` | 14/24 | 400 |
| `type-micro` | 12/16 uppercase | 500 |

Seven steps is the whole vocabulary of the site. **Any single component may use
at most three of them and at most three weights.** That ceiling is what keeps
the hierarchy readable — if a new component seems to need a fourth, it almost
certainly needs to reuse one of the three it already has.

Each component file states its own budget in a comment at the top. Keep those
comments accurate when you change a component.

### Verifying the system still holds

Paste this in the browser console (or via the preview tools) on any page. It
should report empty arrays for the off-grid buckets, a single family, and
only 8/16/24 radii:

```js
const SP=['paddingTop','paddingBottom','paddingLeft','paddingRight','marginTop','marginBottom','rowGap','columnGap'];
const off=new Set(), sizes=new Set(), weights=new Set(), lhs=new Set(), fams=new Set(), radii=new Set();
for (const el of document.querySelectorAll('main *, footer *')) {
  if (!el.getClientRects().length || el.classList.contains('sr-only')) continue;
  const cs = getComputedStyle(el);
  for (const p of SP) { const v = parseFloat(cs[p]) || 0; if (v > 0 && v % 8) off.add(v); }
  const r = parseFloat(cs.borderTopLeftRadius) || 0; if (r > 0 && r < 999) radii.add(r);
  if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
    sizes.add(Math.round(parseFloat(cs.fontSize)));
    weights.add(cs.fontWeight);
    lhs.add(Math.round(parseFloat(cs.lineHeight)));
    fams.add(cs.fontFamily.split(',')[0].replace(/"/g, ''));
  }
}
const sn = s => [...s].sort((a, b) => a - b);
console.log({ offGridSpacing: sn(off), radii: sn(radii), fontSizes: sn(sizes),
  weights: [...weights], offGridLineHeights: sn(lhs).filter(v => v % 8), families: [...fams] });
```

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
