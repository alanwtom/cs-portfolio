# Agent Guidelines — cs-portfolio

This is a Next.js portfolio site deployed to **Vercel** (production domain:
`alantom.dev`, project `cs-portfolio`, team `alans-project`). Git is on
GitHub at `alanwtom/cs-portfolio`; default branch is `main`.

## Standing rules

### 1. Always verify locally before pushing to production

Never push to `main` / deploy to prod without first verifying locally:

```bash
npx tsc --noEmit      # type-check (fastest signal)
npx eslint .          # lint — must exit 0 (or `pnpm lint`)
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
while read id; do vercel rm "https://cs-portfolio-${id}-alans-project.vercel.app" --yes; done < /tmp/delete-ids.txt

rm -rf .next
pkill -f "next dev" 2>/dev/null; pkill -f "next-server" 2>/dev/null
```

**Guarantees:** both keep-set IDs are resolved programmatically or the script
exits without deleting anything; the keep-set is echoed before any deletion.
Deployments are irreversible — never bypass these abort checks.

## The design system (read before building any new component)

**The whole site is one column of 14px text.** That is the entire idea, and
every constraint below exists to protect it. Several of the numbers are not
round — 460 as a font weight, 11.76px of row padding, a 0.45s gap in the
middle of the intro. They are tuned, not placeholders. Don't round them off;
each one has a note saying what it holds up.

What this replaced, so nobody "restores" it by accident: a seven-step type
ramp topping out at a 48px display size, an 8px grid, 24px radii, and a
dark editorial palette with a light mode beside it. All gone. The bet is
that a personal site doesn't need display type at all — the name is set at
the same 14px as the body copy, separated only by weight — and the page is
quiet enough that its one animation carries it. A 40px heading would undo
the whole thing.

### 1. Light only

There is no dark mode and no `dark:` variant. `tailwind.config.ts` has no
`darkMode` key on purpose, so a `dark:` class would silently do nothing.

| token | value | use |
|---|---|---|
| `--background` | `#fdfdfc` | warm off-white; on `html`, not just `body` |
| `--foreground` | `#111111` | all reading copy |
| `--muted-foreground` | `rgba(0,0,0,.4)` | labels, dates, meta — **never** sentences |
| `--border` | `#f2f2f2` | hairlines |
| `--rule` | `#d9d9d9` | the line under a link |

That muted grey is about 2.8:1 on the background, which is under AA. It is
a deliberate call for a date or a section label — things you scan, not read
— and it is not acceptable for anything else. Body copy is `#111`.

`--muted-foreground` carries its own slash-alpha, so **Tailwind's `/60`
opacity modifier cannot be used on it** — `text-muted-foreground/60` emits
a second slash and the colour is dropped. There is only one muted grey.

### 2. One size, two weights

Inter, loaded as a **variable** font — that part is load-bearing. Body copy
is weight 460, a real position on Inter's weight axis and not one of the
static cuts. Pin the font to fixed weights and every line snaps to 500.

| class | size / line-height | weight | letter-spacing |
|---|---|---|---|
| `type-body` | 14 / 20 | 460 | -0.00563rem |
| `type-strong` | 14 / 20 | 500 | -0.00563rem |
| `type-small` | 13 / normal | 460 | -0.0025rem |

Three classes is the entire vocabulary. `type-strong` is for a name and
nothing else. `type-small` is footer small print and the year in an index
row. **Never write `text-lg`, `font-semibold` or a raw `font-size`.**

The letter-spacing is not eyeballed and not optional — Inter is drawn wide
for UI use and needs the pull-in at 14px or the line looks loose.

Index rows are the one place that sets type outside these classes, because
they need `line-height: normal` rather than body copy's 20px. Same size,
same weight, different leading: 20px there makes 44px rows instead of 41px.

### 3. Measure and rhythm

There is no 8px grid any more. The numbers that matter:

| thing | value |
|---|---|
| column | `max-width: 36.375rem` (582px), centred |
| page padding | `5rem 1rem 2.5rem`; `2rem 1.5rem 2.5rem` at ≤768px |
| article | additionally capped at `70ch` |
| paragraph spacing | `padding-top: 1rem` (top, not bottom) |
| section → its label | `pt-12` (48px), label has `pb-2` |
| index row | `padding: 0.735rem 0` → a 41px row |
| footer | `pt-10 pb-20` |

### 4. The intro animation

Pure CSS in `globals.css`, keyed to the DOM shape in `portfolio.tsx`. It
runs on first paint with no JavaScript, no hydration wait and no measuring,
which is why it feels instant — and it means the `prefers-reduced-motion`
block switches it off for free.

```
@keyframes staggerIn { 0% { opacity:0; transform:translateY(8px) } 100% { … } }
0.5s ease both, 50ms between blocks
.article > *   0, .05, .10, .15, .20, .25, .30, .35, then .40 for the 9th on
section        .45      section:nth-of-type(2)  .50      footer  .55
```

Two things about this are easy to "fix" and must not be:

- The sections **restart at 0.45s** instead of continuing the count, which
  leaves a gap after the last paragraph. That gap is the best part — the
  copy lands, then the index follows a beat later.
- Everything past the 8th block shares 0.40s, so a long article can't drip.

This is keyed to structure, so `portfolio.tsx` has to stay: `main.stagger`
containing an `article` (header + paragraphs), then two `section`s, then a
`footer`. Reorder them and the cascade silently loses its timing.

An earlier attempt did this in Framer Motion with a per-element in-view
check. It worked, but it needed the page to hydrate before anything moved,
and it needed its own reduced-motion handling. CSS is both more faithful
and less code. Don't reach for Framer Motion for the intro again.

**Verifying motion:** the Browser pane freezes `requestAnimationFrame` when
it isn't visible, so Framer Motion animations sit at their initial frame
and look broken when they are fine. CSS animations are less affected but
still throttle. Verify motion in headless Chrome over CDP, not in the pane.

### Interaction: the list dims, the row doesn't light up

Hovering an `.index-list` drops every row to 30% and the row under the
cursor stays at 1, over 0.14s. The list steps back to let one item through,
rather than one item highlighting. Pointer-only (`(hover: hover) and
(pointer: fine)`) — on a touch screen `:hover` fires on tap and would dim
the list at the moment you are trying to open something.

### Media bleeds, copy insets

`ProjectModal` is the one surface that shows an image, so it is the one
place with a shape of its own. Its type still comes from the three classes
above. Two rules hold it up:

- **Media runs full bleed.** The panel carries no padding of its own; the
  snapshot reaches all four edges and inherits the panel's top corners, and
  only the copy underneath is inset. That is the difference between an
  editorial spread and a padded box with a picture in it, which is what
  every AI-built modal defaults to.
- **Never put text over raw photography without a gradient scrim.** The
  title sits on a black scrim over the snapshot, which is also why
  `ProjectCover` stays dark even though the site is light.

Overlays use `.overlay-scrim` and `.overlay-panel`. On a light page you
can't dim your way to depth — a black scrim over an off-white sheet just
reads as the lights going out — so the scrim is white at 80% with a 1rem
backdrop blur, and the panel is lifted by a seven-layer shadow whose
largest step is 4% black.

Write `backdrop-filter` **unprefixed only**. Hand-writing the `-webkit-`
line alongside it makes the minifier collapse the pair and keep only the
prefixed one, which Chrome ignores — the blur then vanishes everywhere but
Safari. The build adds prefixes from browserslist.

Modal easing is `cubic-bezier(0.625, 0.05, 0, 1)` at 0.25–0.3s, deliberately
not a spring: overshoot on a panel this size reads as cheap and fights the
scrim fading in. This predates the current type system and was kept.

### Project snapshots and tech icons

The project modal leads with a picture, not prose. Two rules keep that
working:

- **Snapshots** live in `public/images/projects/` and are referenced by the
  `shot` field on a project in `lib/constants.ts`. They must be **2:1** —
  the modal reserves that box either way. A project with no `shot` gets
  `ProjectCover` instead: its primary tech's mark over a dot grid, tinted
  with that tech's brand colour. So a missing screenshot looks deliberate
  rather than broken, and dropping one in later changes no layout.

  To capture one from a live site (needs the full app window in frame):

  ```bash
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size=1440,1500 --force-device-scale-factor=2 \
    --virtual-time-budget=9000 --screenshot=/tmp/shot.png https://example.com
  # crop to the region you want, then encode 2:1 at 1600px wide
  cwebp -crop <x> <y> <w> <h> -resize 1600 0 -q 82 /tmp/shot.png -o public/images/projects/name.webp
  ```

  Bump `ASSET_VERSION` after replacing an existing one. Adding a *new*
  filename needs no bump.

  Some of these already exist elsewhere on this machine. `flow.webp` is
  cropped from `~/Documents/GitHub/Flow/store-screenshots/chrome/01-youtube.png`
  (the Chrome Web Store submission). Check the sibling repo before
  screenshotting a marketing page: a store submission is a better source,
  because it shows the actual product UI. Note the Chrome set is 1280x800
  and the Mozilla set is 2400x1800 but 4:3 — the taller one looks like the
  better source and isn't, because Flow's popup is too tall to survive a
  2:1 crop at that aspect.

- **Tech icons** come from `components/TechIcon.tsx`. Add a `BRAND` entry
  (a `simple-icons` export) when a real logo exists, or a `GLYPH` entry
  (a lucide icon) when it doesn't — don't hand-draw a logo. Brand marks keep
  their brand colour, which is the one deliberate exception to the
  single-palette rule; `brandFill` darkens anything too pale for the white
  card and drops anything too dark to inherit the text colour, so nothing
  goes invisible in either theme. Bare-name coverage matters: the map is
  keyed on the lowercased `tech` string, so renaming a tech in
  `constants.ts` silently falls back to a generic glyph.

### Verifying the system still holds

Paste this into the console on the live page. The site is austere enough
that the whole system fits in one assertion: **two font sizes, two weights,
one family, and one text colour plus one muted grey.**

```js
const sizes=new Set(), weights=new Set(), lhs=new Set(), fams=new Set(),
      colors=new Set(), ls=new Set();
for (const el of document.querySelectorAll('main *')) {
  if (!el.getClientRects().length || el.classList.contains('sr-only')) continue;
  if (![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
  const cs = getComputedStyle(el);
  sizes.add(Math.round(parseFloat(cs.fontSize)));
  weights.add(cs.fontWeight);
  lhs.add(cs.lineHeight);
  fams.add(cs.fontFamily.split(',')[0].replace(/"/g, ''));
  colors.add(cs.color);
  ls.add(cs.letterSpacing);
}
const sn = s => [...s].sort((a, b) => a - b);
console.log({ fontSizes: sn(sizes), weights: [...weights], families: [...fams],
  lineHeights: [...lhs], colors: [...colors], letterSpacing: [...ls] });
```

Expected, exactly:

```
fontSizes:     [13, 14]
weights:       ["460", "500"]
families:      ["Inter"]
lineHeights:   ["20px", "normal"]
colors:        ["rgb(17, 17, 17)", "rgba(0, 0, 0, 0.4)"]
letterSpacing: ["-0.09008px", "-0.04px"]
```

A third font size, a 400 or 600 weight, or a third colour means something
reintroduced the old ramp. Row geometry should hold too — every
`.index-row` is 41px:

```js
[...document.querySelectorAll('.index-row')].map(r => Math.round(r.getBoundingClientRect().height))
```

## Toolchain notes

- **Package manager:** `pnpm` (v11). `onlyBuiltDependencies` lives in
  **`pnpm-workspace.yaml`**, NOT `package.json`.
- **Linting** is ESLint 9 flat config in `eslint.config.mjs`, spreading
  `eslint-config-next/{core-web-vitals,typescript}` (v16 exports real flat
  configs — no `FlatCompat` shim needed). Run `npx eslint .` or `pnpm lint`.
  The old `.eslintrc.json` is gone; ESLint 9 silently ignored it, so for a
  while nothing in this repo was being linted at all. If you see
  "couldn't find an eslint.config file", the flat config went missing —
  don't re-add an `.eslintrc`.
- **Don't cache-bust image URLs with `Date.now()`.** It changes the URL every
  render, so the browser re-downloads the image (the profile photo used to
  visibly blank out) and social scrapers can never cache the OG preview.
  Bump `ASSET_VERSION` in `lib/constants.ts` instead.
- **OG image** must be true **1200×630** — platforms stretch mismatched
  aspect ratios. Source: `public/images/buttercup_og.png`.
- **Force-push to `main`:** avoid. Prefer append a revert commit to keep
  history honest (append-only).

## Key file map

- `portfolio.tsx` (root) — the whole single-page layout
- `app/layout.tsx` — metadata, OG/Twitter tags, Inter variable font, JSON-LD
- `app/globals.css` — palette, the three type classes, the CSS intro,
  index-row hover, overlay treatment, a11y focus rings
- `components/` — `ProjectCard` (one index row), `ProjectModal`,
  `ProjectCover`, `TechIcon`, `ErrorBoundary`
- `lib/constants.ts` — content (projects, experiences, social URLs)
