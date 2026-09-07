import {
  siApple,
  siCplusplus,
  siCss,
  siDiscord,
  siGooglechrome,
  siGooglecloud,
  siHtml5,
  siJavascript,
  siPython,
  siSwift,
} from "simple-icons";
import {
  ArrowDownUp,
  FlaskConical,
  Layers,
  Puzzle,
  RefreshCw,
  Webhook,
  type LucideIcon,
} from "lucide-react";

/*
  One tech name in, one 16px mark out.

  Brand logos where a real one exists (from simple-icons, so the paths are
  official rather than my approximation of them), and a plain line glyph
  where it doesn't — SwiftUI, libtorrent and Nox have no logo, and inventing
  one would just look wrong.

  The brand marks keep their brand colour. That's a deliberate exception to
  the site's single-palette rule: these are content, not chrome, and the
  colour is most of what makes a logo recognisable at 16px. Everything
  around them stays monochrome so they read as accents rather than noise.
*/

type Brand = { path: string; hex: string };

/*
  Brand colours have to survive both of this site's surfaces: a near-black
  panel in dark mode and a white one in light mode. Two of them don't, as
  shipped.

  Apple's is literally #000000 — invisible on the dark panel, and there's no
  hue worth rescuing, so it falls back to the surrounding text colour and the
  shape does the work.

  JavaScript's yellow is #F7DF1E, which is about 1.4:1 against the white card
  — also invisible, just in the other theme. Here the hue IS the recognition,
  so instead of discarding it we walk the brightness down until it clears the
  3:1 that WCAG asks of non-text graphics. A dark gold still reads as
  JavaScript. A grey square doesn't.

  Everything else already clears 3:1 on at least the surface it needs to and
  is left exactly as the brand specifies.
*/

/** WCAG relative luminance for an 8-bit channel triple. */
function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  );
}

/** Contrast ratio against pure white, which is the light theme's card. */
function contrastOnWhite(r: number, g: number, b: number): number {
  return 1.05 / (relativeLuminance(r, g, b) + 0.05);
}

function brandFill(hex: string): string {
  const n = parseInt(hex, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;

  // Near-black: no usable hue, so inherit the text colour.
  if (relativeLuminance(r, g, b) < 0.02) return "currentColor";

  // Too pale for the white card: darken in place, preserving the hue, until
  // it clears 3:1. Steps of 4% converge in a handful of passes.
  let scale = 1;
  while (
    scale > 0.3 &&
    contrastOnWhite(r * scale, g * scale, b * scale) < 3
  ) {
    scale -= 0.04;
  }

  const channel = (v: number) =>
    Math.round(v * scale)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

const BRAND: Record<string, Brand> = {
  "swift 6": siSwift,
  swift: siSwift,
  appkit: siApple,
  "ios extensions": siApple,
  "c++": siCplusplus,
  python: siPython,
  "discord.py": siDiscord,
  gcp: siGooglecloud,
  javascript: siJavascript,
  "chrome extension api": siGooglechrome,
  html: siHtml5,
  css: siCss,
};

// No logo exists for these, so they get a glyph that describes the job.
const GLYPH: Record<string, LucideIcon> = {
  swiftui: Layers,
  libtorrent: ArrowDownUp,
  sparkle: RefreshCw,
  webhooks: Webhook,
  "webhook api": Webhook,
  nox: FlaskConical,
};

export function TechIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const key = name.toLowerCase();

  const brand = BRAND[key];
  if (brand) {
    return (
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-hidden="true"
        className={className}
        style={{ fill: brandFill(brand.hex) }}
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const Glyph = GLYPH[key] ?? Puzzle;
  return <Glyph className={className} aria-hidden="true" />;
}

/** Brand colour for a tech, when it has one. Used to tint generated covers. */
export function techAccent(name: string): string | undefined {
  const brand = BRAND[name.toLowerCase()];
  if (!brand) return undefined;
  const fill = brandFill(brand.hex);
  // A mark that fell back to currentColor has no usable accent to tint with.
  return fill === "currentColor" ? undefined : fill;
}
