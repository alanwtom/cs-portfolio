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

  return (
    <motion.div
      className="group relative w-full cursor-pointer border-t border-border py-6 first:border-t-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-medium text-foreground transition-colors group-hover:text-foreground">
          {project.title}
        </h3>
        <ArrowUpRight
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200",
            "group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          )}
        />
      </div>

      <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground/80">
        {project.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
