"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  index: number;
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
 * A bullet and a name on the left, the year hard against the right edge.
 * Two anchors, so the row spans the full column width. An earlier version
 * put the year in a fixed left gutter sized for the longest value on the
 * page, which left every other row with a hole punched through its middle.
 *
 * Everything cut from here still exists in the modal, which is what the
 * row opens — this is an index entry, not a summary.
 *
 * 40px rows: 24px line-height plus 8px top and bottom, so the whole table
 * stays on the 8px grid. Rows are separated by a bullet per entry rather
 * than by hairline rules. Keyboard accessible (Enter / Space).
 */
export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
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
        className="type-meta flex w-full cursor-pointer items-baseline gap-2 py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {/* Bullet sits against the name, 8px away, so it reads as a list
            marker rather than as a column of its own. */}
        <span
          aria-hidden="true"
          className="shrink-0 text-muted-foreground/40"
        >
          &bull;
        </span>

        {/* flex-1 on the name is what pushes the year to the right edge,
            which is the whole trick: the row gets an anchor at each end and
            spans the column, instead of huddling on the left with a void
            beside it. */}
        <span className="flex-1 truncate text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:decoration-border">
          {project.title}
        </span>

        <span className="shrink-0 whitespace-nowrap text-muted-foreground/60">
          {project.year}
        </span>
      </div>
    </motion.li>
  );
}
