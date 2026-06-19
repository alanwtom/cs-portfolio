"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ScrollSection {
  id: string;
  label: string;
}

interface ScrollProgressProps {
  sections: ScrollSection[];
}

/**
 * Vertical section rail (fixed, left edge, desktop only): one tick mark per
 * section. The tick for the section currently in view expands/fills, and
 * clicking a tick smooth-scrolls to that section.
 *
 * Respects prefers-reduced-motion.
 */
export function ScrollProgress({ sections }: ScrollProgressProps) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");
  const reduced = usePrefersReducedMotion();

  // Highlight the section currently centered in the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      {
        // Trigger when a section's middle band crosses the viewport middle.
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 1],
      }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const handleJump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {sections.map(({ id, label }) => {
        const isActive = activeId === id;
        return (
          <button
            key={id}
            onClick={() => handleJump(id)}
            className="group flex items-center gap-3"
            aria-label={`Jump to ${label}`}
            aria-current={isActive ? "true" : undefined}
          >
            <span
              className={cn(
                "block h-px transition-all duration-300",
                isActive
                  ? "w-8 bg-foreground"
                  : "w-4 bg-foreground/25 group-hover:w-6 group-hover:bg-foreground/50"
              )}
            />
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300",
                isActive
                  ? "text-foreground opacity-100"
                  : "text-foreground/40 opacity-0 group-hover:opacity-100"
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
