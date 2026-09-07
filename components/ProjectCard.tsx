"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { Project } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

/**
 * Minimal editorial project row (Emil-style): title + external arrow on the
 * left, one-line description below, mono tech tags trailing. Clicking the row
 * opens the detailed ProjectModal. Keyboard accessible (Enter / Space).
 */
export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const reduced = useReducedMotion();

  // `transition-colors` below, never `transition-all`: Motion animates this
  // row's opacity as it scrolls into view, and `transition-all` tells CSS to
  // transition opacity as well. The two then fight over the same property every
  // frame — Motion writes a value, CSS starts a fresh 300ms interpolation from
  // wherever it had got to — which is the flicker these rows had while
  // scrolling. Firefox showed it plainly; Chrome mostly hid it.
  return (
    <motion.div
      className="group relative w-full cursor-pointer rounded-lg px-4 py-4 -mx-4 transition-colors duration-300 hover:bg-secondary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      initial={reduced ? false : { opacity: 0 }}
      whileInView={reduced ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground">
          {project.title}
        </h3>
        <ArrowUpRight
          className={cn(
            // Narrowed for the same reason, though this one was never the
            // cause: the arrow only moves and changes colour on hover.
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-[transform,color] duration-200",
            "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          )}
        />
      </div>

      <p className="mt-1.5 max-w-prose text-base leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
        {project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-sm text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
