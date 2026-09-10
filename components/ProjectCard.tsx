"use client";

import type { Project } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

/**
 * One project, as a single index row.
 *
 * Budget: 2 type classes (body for the name, small for the year), 1 weight.
 *
 * Name hard against the left, year hard against the right, nothing in
 * between. There is no bullet and no rule: the rows are separated by their
 * own 11.76px of padding and nothing else, which is enough at this size.
 *
 * The row doesn't highlight on hover — the list dims around it. Hovering
 * anywhere in the list drops every row to 30% and the one under the cursor
 * stays at full, so the list steps back to let one item through rather than
 * one item lighting up. That's in globals.css, on `.index-list`, because it
 * needs the parent's hover state and can't be expressed from in here.
 *
 * Keyboard accessible (Enter / Space) — it opens the detail modal.
 */
export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <li>
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
        className="index-row"
      >
        <span className="flex-1 truncate">{project.title}</span>
        <span className="type-small shrink-0 whitespace-nowrap text-muted-foreground">
          {project.year}
        </span>
      </div>
    </li>
  );
}
