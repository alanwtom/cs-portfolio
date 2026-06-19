"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SectionHeadingProps {
  /** Small muted label above the title, e.g. "02 — Experience". */
  index?: string;
  title: string;
}

/**
 * Editorial section header: a small monospace index/overline on top of a
 * lightweight title. Used to break the long-scroll page into clear sections,
 * matching Emil's understated section labels.
 */
export function SectionHeading({ index, title }: SectionHeadingProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="mb-10 flex flex-col gap-2"
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {index && (
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {index}
        </span>
      )}
      <h2 className="text-2xl font-medium tracking-tight text-foreground">
        {title}
      </h2>
    </motion.div>
  );
}
