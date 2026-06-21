"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export interface ScrollSection {
  id: string;
  label: string;
}

interface ScrollProgressProps {
  sections: ScrollSection[];
}

/**
 * Revamped Vertical section rail (fixed, left edge, desktop only).
 * Renders extremely compact tick marks (12 ticks total) that scale in width
 * and opacity to form a curving "arch" pointing to the active scroll position.
 * The labels' opacities are bound directly to the Gaussian bulge factor (distance to the peak).
 *
 * Respects prefers-reduced-motion.
 */
export function ScrollProgress({ sections }: ScrollProgressProps) {
  const NUM_TICKS = 12; // Compacted to 12 ticks to minimize vertical space on the page
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionProgresses, setSectionProgresses] = useState<Record<string, number>>({});
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  // Track page scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) {
        setScrollProgress(0);
        return;
      }
      const progress = window.scrollY / totalHeight;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate the scroll progress targets for each section based on their layout offsets
  useEffect(() => {
    const updatePositions = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      
      const newProgresses: Record<string, number> = {};
      sections.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const scrollTop = window.scrollY + rect.top;
          const progress = Math.min(1, Math.max(0, scrollTop / totalHeight));
          newProgresses[id] = progress;
        }
      });
      setSectionProgresses(newProgresses);
    };

    // Calculate layout positions initially, on resize, and on load
    updatePositions();
    window.addEventListener("resize", updatePositions);
    window.addEventListener("load", updatePositions);

    // Also run a delayed check to account for dynamic hydration or client layout settling
    const timer = setTimeout(updatePositions, 500);

    return () => {
      window.removeEventListener("resize", updatePositions);
      window.removeEventListener("load", updatePositions);
      clearTimeout(timer);
    };
  }, [sections]);

  // Map each section's calculated progress to the closest tick index
  const sectionTickMapping = useMemo(() => {
    const mapping: Record<string, number> = {};
    sections.forEach(({ id }) => {
      const prog = sectionProgresses[id] ?? 0;
      const tickIdx = Math.min(NUM_TICKS - 1, Math.max(0, Math.round(prog * (NUM_TICKS - 1))));
      mapping[id] = tickIdx;
    });
    return mapping;
  }, [sections, sectionProgresses]);

  // Map tick index back to its corresponding section (if any)
  const tickToSection = useMemo(() => {
    const mapping: Record<number, ScrollSection> = {};
    sections.forEach((sec) => {
      const tickIdx = sectionTickMapping[sec.id];
      if (tickIdx !== undefined) {
        mapping[tickIdx] = sec;
      }
    });
    return mapping;
  }, [sections, sectionTickMapping]);

  // Determine active section based on proximity to current scroll progress
  const activeSectionId = useMemo(() => {
    let closestId = sections[0]?.id ?? "";
    let minDiff = 1.0;
    sections.forEach(({ id }) => {
      const prog = sectionProgresses[id] ?? 0;
      const diff = Math.abs(scrollProgress - prog);
      if (diff < minDiff) {
        minDiff = diff;
        closestId = id;
      }
    });
    return closestId;
  }, [sections, sectionProgresses, scrollProgress]);

  const handleJumpToProgress = (progress: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: progress * totalHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const handleJumpToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      aria-label="Sections"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-[2px] lg:flex"
    >
      {Array.from({ length: NUM_TICKS }).map((_, i) => {
        const tickProgress = i / (NUM_TICKS - 1);
        const diff = Math.abs(scrollProgress - tickProgress);

        // Gaussian bulge formula to scale width and opacity of the current point
        const sigma = 0.12; // Spread width of the pointing arch
        const factor = Math.exp(-(diff * diff) / (2 * sigma * sigma));
        const scale = 0.25 + 0.75 * factor;
        const opacity = 0.25 + 0.75 * factor;

        const section = tickToSection[i];
        const isSectionActive = section && activeSectionId === section.id;
        
        // Label opacity is bound directly to the Gaussian factor (distance to peak)
        // Show fully opaque if hovered, otherwise follow the smooth scroll fade progress
        const targetOpacity = hoveredIdx === i ? 1.0 : factor;

        return (
          <div
            key={i}
            className="group relative flex h-2 items-center"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Tick line button */}
            <button
              onClick={() => {
                if (section) {
                  handleJumpToSection(section.id);
                } else {
                  handleJumpToProgress(tickProgress);
                }
              }}
              className="flex h-full w-8 items-center focus-visible:outline-none"
              aria-label={
                section
                  ? `Jump to ${section.label}`
                  : `Scroll to ${Math.round(tickProgress * 100)}%`
              }
            >
              <span
                className="block h-[1.5px] origin-left bg-foreground transition-colors duration-200"
                style={{
                  transform: `scaleX(${scale})`,
                  opacity: opacity,
                  width: "32px", // Base width
                }}
              />
            </button>

            {/* Label, aligned to the right of the tick lines */}
            {section && (
              <button
                onClick={() => handleJumpToSection(section.id)}
                className={cn(
                  "absolute left-10 text-[10px] font-medium uppercase tracking-[0.2em] transition-[transform] group-hover:transition-all duration-300 whitespace-nowrap focus-visible:outline-none text-foreground",
                  isSectionActive ? "translate-x-0" : "translate-x-0 group-hover:translate-x-1"
                )}
                style={{
                  opacity: targetOpacity,
                }}
              >
                {section.label}
              </button>
            )}
          </div>
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
