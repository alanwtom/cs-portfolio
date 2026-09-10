"use client";

import { Reveal } from "@/components/Reveal";

interface SectionHeadingProps {
  /** Small muted label above the title, e.g. "02 — Experience". */
  index?: string;
  title: string;
  /** Position in the page's arrival cascade — see Reveal. */
  order: number;
}

/**
 * Section header. Breaks the long scroll into clearly labelled sections.
 *
 * Budget: 1 size (24), 1 weight (500), plus the optional micro index — which
 * nothing currently passes. Numbered sections were tried and dropped.
 * Spacing: 8px between index and title, 24px down to the section body.
 */
export function SectionHeading({ index, title, order }: SectionHeadingProps) {
  return (
    <Reveal order={order} className="mb-6 flex flex-col gap-2">
      {index && (
        <span className="type-micro text-muted-foreground/70">{index}</span>
      )}
      <h2 className="type-title text-foreground">{title}</h2>
    </Reveal>
  );
}
