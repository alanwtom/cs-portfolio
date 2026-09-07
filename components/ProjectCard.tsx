"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  index: number;
  /**
   * False when the project above shares this year, which blanks the gutter
   * so a run of same-year projects reads as one group.
   */
  showYear: boolean;
  onClick: () => void;
}

/**
 * One project, compressed to a single index row.
 *
 * Budget: 1 size (14), 1 weight (400). Hierarchy comes entirely from
 * colour: the name is full-strength foreground, everything else is muted.
 * That is the trick that lets a whole row sit on one line without any of
 * it shouting.
 *
 * This used to be a title, a description, and a wrapped row of tech chips,
 * about five lines per project. It is now a bullet, a year and a name.
 * Everything cut from here still exists in the modal, which is what the
 * row opens — the row is an index entry, not a summary.
 *
 * 40px rows: 24px line-height plus 8px top and bottom, so the whole table
 * stays on the 8px grid. Rows are separated by a bullet per entry rather
 * than by hairline rules. Keyboard accessible (Enter / Space).
 */
export function ProjectCard({
  project,
  index,
  showYear,
  onClick,
}: ProjectCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.li
      className="group"
      initial={reduced ? false : { opacity: 0 }}
      whileInView={reduced ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
          }
        }}
        className="type-meta flex w-full cursor-pointer items-baseline gap-4 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Bullet leads the row. */}
        <span
          aria-hidden="true"
          className="w-2 shrink-0 text-muted-foreground/40"
        >
          &bull;
        </span>

        {/* Year, shown once per group and blank on the rows beneath it.
            It stays visible on mobile now: with the description and tech
            columns gone there is no longer any width to compete for. */}
        <span className="w-40 shrink-0 whitespace-nowrap text-muted-foreground/60">
          {showYear ? project.year : ""}
        </span>

        <span className="flex-1 truncate text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:decoration-border">
          {project.title}
        </span>
      </div>
    </motion.li>
  );
}
