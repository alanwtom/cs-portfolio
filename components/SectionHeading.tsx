"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SectionHeadingProps {
  /** Small muted label above the title, e.g. "02 — Experience". */
  index?: string;
  title: string;
}

/**
 * Section header. Breaks the long scroll into clearly labelled sections.
 *
 * Budget: 1 size (24), 1 weight (500), plus the optional micro index — which
 * nothing currently passes. Numbered sections were tried and dropped.
 * Spacing: 8px between index and title, 24px down to the section body.
 */
export function SectionHeading({ index, title }: SectionHeadingProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="mb-6 flex flex-col gap-2"
      initial={reduced ? false : { opacity: 0 }}
      whileInView={reduced ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {index && (
        <span className="type-micro text-muted-foreground/70">{index}</span>
      )}
      <h2 className="type-title text-foreground">{title}</h2>
    </motion.div>
  );
}
