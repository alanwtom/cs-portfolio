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
 * about five lines per project. Now it is four columns on one 40px line:
 * year, name, one-line description, primary tech. Everything cut from here
 * still exists in the modal, which is what the row opens.
 *
 * 40px rows: 24px line-height plus 8px top and bottom, so the whole table
 * stays on the 8px grid. Keyboard accessible (Enter / Space).
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
      className="group border-t border-border"
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
        {/* Year gutter. w-40 matches the Experience table's gutter exactly,
            so the two tables share one column grid and the titles below line
            up with the companies above. It's wider than "2026" needs, but a
            visible step between two stacked tables looks like a mistake and
            generous space in front of a grouped year does not.

            Same rule as Experience: least load-bearing column, so it's the
            one that drops on a phone. */}
        <span className="hidden w-40 shrink-0 text-muted-foreground/60 sm:block">
          {showYear ? project.year : ""}
        </span>

        <span className="w-24 shrink-0 text-foreground underline decoration-transparent underline-offset-4 transition-colors duration-200 group-hover:decoration-border sm:w-32">
          {project.title}
        </span>

        {/* The description is what makes the row readable — "Current" on its
            own tells you nothing — so on a narrow screen this is the column
            that survives and the tech mark is the one that goes. */}
        <span className="flex-1 truncate text-muted-foreground transition-colors duration-200 group-hover:text-foreground/80">
          {project.description}
        </span>

        <span className="hidden shrink-0 whitespace-nowrap text-muted-foreground/60 sm:block">
          {project.tech[0]}
        </span>
      </div>
    </motion.li>
  );
}
