import { TechIcon, techAccent } from "./TechIcon";

/*
  Stand-in cover for a project with no screenshot yet.

  The point is that it should look like a decision rather than a missing
  image: the project's primary tech mark, large and dimmed, over a glow in
  that tech's own brand colour, sitting on a dot grid at 8px pitch, the same
  grid the rest of the site is built on.

  Deliberately dark in BOTH themes, unlike every other surface here. It is
  standing in for a screenshot, screenshots of this stuff are dark, and the
  modal writes a white title straight over the top of it. A cover that went
  pale in light mode would take that title with it.
*/
export function ProjectCover({
  tech,
  title,
}: {
  tech: string[];
  title: string;
}) {
  const primary = tech[0];
  const accent = techAccent(primary) ?? "#ffffff";
  const gridId = `grid-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div
      className="relative aspect-[2/1] w-full overflow-hidden bg-[#0a0a0a]"
      role="img"
      aria-label={`${title}, no screenshot yet`}
    >
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          {/* 8px pitch, matching the site's base grid. */}
          <pattern
            id={gridId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.14)" />
          </pattern>
          <radialGradient id={`${gridId}-glow`} cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.34" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        <rect width="100%" height="100%" fill={`url(#${gridId}-glow)`} />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <TechIcon name={primary} className="h-16 w-16 opacity-50" />
      </div>
    </div>
  );
}
