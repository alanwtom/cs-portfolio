"use client";

import { motion, type Transition } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * The page's arrival animation.
 *
 * Budget: no type of its own — it wraps whatever it's given. Motion only.
 *
 * Lifted from benji.org, which is the nicest version of this I've seen. The
 * whole trick is that the page doesn't fade in as one sheet; it arrives block
 * by block down the column, 50ms apart, each one rising 8px as it fades. It
 * reads like the page is being set in front of you, in reading order. A flat
 * crossfade of everything at once — which is what this site did before — has
 * no rhythm, so it just reads as "slow".
 *
 * His exact numbers, kept:
 *
 *     0% { opacity: 0; transform: translateY(8px) }  →  100% { opacity: 1 }
 *     0.5s, CSS `ease`, 50ms between blocks
 *
 * 8px happens to be this site's grid unit, so the rise is one grid step. The
 * 0.5s duration is doing the work — long enough that the movement is legible
 * rather than a flinch, short enough that the last block has landed inside
 * about a second.
 *
 * ── Why there are two triggers ──────────────────────────────────────────
 *
 * benji.org animates every block on load, whether or not you can see it, so
 * his footer has finished moving before anyone scrolls to it. That works
 * because his page is barely two screens tall. This one is longer and already
 * revealed its lower half on scroll, so a block asks — once, at mount —
 * whether it is on the first screen:
 *
 *   • On the first screen → it's part of the intro, and takes its delay from
 *     `order`, its position down the page.
 *   • Below it → it keeps the scroll reveal, using the same 8px rise so the
 *     page only ever speaks one motion language.
 *
 * Deciding this per element rather than hardcoding which sections are "above
 * the fold" is what keeps it honest on both a laptop and a tall monitor. The
 * measurement happens in a ref callback, during commit, so it lands before
 * Framer sets up its intersection observers — measuring in an effect instead
 * races them, and the cascade loses to whichever fires first.
 */

/** 50ms between blocks. */
export const STAGGER_STEP = 0.05;

/**
 * Nothing waits longer than this to start. Only blocks on the first screen
 * cascade, so on a normal viewport the cap never fires — it's a guard for a
 * very tall monitor, or for this page getting longer later, where a strict
 * 50ms-per-block would leave the last row sitting there for a beat too long.
 */
const MAX_INTRO_DELAY = 0.6;

const HIDDEN = { opacity: 0, y: 8 };
const SHOWN = { opacity: 1, y: 0 };

/** CSS `ease`, spelled out — benji.org's timing, not a framer preset. */
const TRANSITION: Transition = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };

/**
 * All three take an identical prop set, so the lookup gets narrowed to one of
 * them rather than fighting a union of three component types.
 */
const TAGS = { div: motion.div, p: motion.p, li: motion.li };

type Phase = "measuring" | "intro" | "scroll";

interface RevealProps {
  /**
   * Position in the top-to-bottom cascade, counting every block on the page
   * from the name at 0. Only used if this block is on the first screen.
   */
  order?: number;
  /**
   * Delay when this block reveals on scroll instead — measured from when it
   * enters view, so it's a stagger within its own group of rows, not a
   * page-wide position. Defaults to no delay.
   */
  scrollDelay?: number;
  as?: keyof typeof TAGS;
  className?: string;
  children: React.ReactNode;
}

export function Reveal({
  order = 0,
  scrollDelay = 0,
  as = "div",
  className,
  children,
}: RevealProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("measuring");
  const measured = useRef(false);

  const measure = useCallback((el: HTMLElement | null) => {
    if (!el || measured.current) return;
    measured.current = true;
    setPhase(
      el.getBoundingClientRect().top < window.innerHeight ? "intro" : "scroll"
    );
  }, []);

  const Tag = TAGS[as] as typeof motion.div;

  // No initial/animate at all, so the block is simply present.
  if (reduced) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      ref={measure}
      className={className}
      initial={HIDDEN}
      // `measuring` lasts one frame, before paint, and holds at HIDDEN — so
      // there's no flash of the finished state while we work out the trigger.
      animate={phase === "intro" ? SHOWN : undefined}
      whileInView={phase === "scroll" ? SHOWN : undefined}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        ...TRANSITION,
        delay:
          phase === "intro"
            ? Math.min(order * STAGGER_STEP, MAX_INTRO_DELAY)
            : scrollDelay,
      }}
    >
      {children}
    </Tag>
  );
}
