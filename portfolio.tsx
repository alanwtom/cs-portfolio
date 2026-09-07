"use client";

import { Github } from "lucide-react";
import { useTheme } from "./components/theme-provider";
import { ProjectCard } from "./components/ProjectCard";
import { SectionHeading } from "./components/SectionHeading";
import dynamic from "next/dynamic";

import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import {
  PROJECTS,
  EXPERIENCES,
  GITHUB_URL,
  X_URL,
} from "./lib/constants";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "./hooks/use-reduced-motion";

// Lazy-load modal to reduce initial bundle size
const ProjectModal = dynamic(
  () => import("./components/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false }
);

export default function Portfolio() {
  const { isLoaded } = useTheme();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useKeyboardShortcuts({
    onThemeToggle: () => {},
    onEscapePress: () => {
      if (selectedProject !== null) setSelectedProject(null);
    },
  });

  // Remember last focused element and restore it when modal closes.
  useEffect(() => {
    if (selectedProject !== null) {
      lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [selectedProject]);

  // Show loading state while theme is being loaded.
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-foreground" />
      </div>
    );
  }

  return (
    <motion.div
      className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground"
      initial={reduced ? false : { opacity: 0 }}
      animate={reduced ? undefined : { opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="type-body sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-sm bg-primary px-4 py-2 text-primary-foreground transition-all duration-200"
      >
        Skip to main content
      </a>

      {/* Top progress bar is gone; sidebar rail handles section nav */}

      {/* max-w-2xl is 672px = 84 × 8, and the 24px gutter matches --inset,
          so the text column itself sits on the grid. */}
      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl flex-1 px-inset"
      >
        {/* ───────────────────────── Hero ─────────────────────────
            Budget: 3 sizes (40 / 12 / 16), 2 weights (500, 400). Big name,
            uppercase micro role line, body copy. */}
        <section id="hero" className="scroll-mt-16 pt-20 pb-8 md:pb-10 md:pt-28">
          {/* The profile photo used to sit to the right of this. It was a
              3024x4032 phone photo being displayed at 112px, so the browser
              downloaded 380KB to paint a thumbnail, and it was the slowest
              thing on the page by a wide margin. The file is still in
              public/images if it ever comes back; resize it first. */}
          <div>
            <h1 className="type-display text-foreground">Alan Tom</h1>
            <p className="type-micro mt-4 text-muted-foreground">
              Computer Science senior at Syracuse University
            </p>
          </div>

          <div className="type-body mt-12 max-w-xl space-y-6 text-muted-foreground">
            <p>
              Currently building{" "}
              <span className="mc-enchant">
                <Underline href="https://fwrdsms.com">Fwrd</Underline>
              </span>
              , a privacy-forward iOS app that automatically forwards SMS to
              Discord, Slack, and Telegram.
            </p>
            <p>
              Former Researcher at{" "}
              <Underline href="https://ischool.syracuse.edu/summer-paid-research-experience/">
                iSchool NSF REU
              </Underline>
              , and President of{" "}
              <Underline href="https://cusehacks.com">CuseHacks</Underline>
              .
            </p>
          </div>
        </section>

        {/* ───────────────────────── Projects ─────────────────────
            An index, not a set of cards: one 40px row each, hairline
            separated, click a row for the detail. */}
        <section id="projects" className="scroll-mt-16 py-8 md:py-10">
          <SectionHeading title="Projects" />
          <ul className="flex flex-col border-b border-border">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                showYear={PROJECTS[index - 1]?.year !== project.year}
                onClick={() =>
                  setSelectedProject(
                    selectedProject === index ? null : index
                  )
                }
              />
            ))}
          </ul>
        </section>

        {/* ─────────────────────── Experience ─────────────────────── */}
        <section id="experience" className="scroll-mt-16 py-8 md:py-10">
          <SectionHeading title="Experience" />
          {/* Same index row as Projects: 1 size (14), 1 weight, hierarchy
              from colour alone. Years sit in a left gutter, company at full
              strength, role muted on the right.

              `transition-colors`, not `transition-all`: Motion animates each
              row's opacity on scroll-in, and `transition-all` makes CSS
              transition opacity too, so the two fight over it every frame.
              That was the flicker down this section in Firefox. */}
          <ul className="flex flex-col border-b border-border">
            {EXPERIENCES.map((item, idx) => (
              <motion.li
                key={item.company + item.role}
                className="type-meta flex items-baseline gap-4 border-t border-border py-2"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={reduced ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.04 }}
              >
                {/* Years go first on the grid but are the least load-bearing
                    fact, so they're the column that drops on a phone.

                    w-40 and nowrap, not w-32: "4 semesters · 2024–2026" is
                    the longest value and it wrapped to two lines in a 128px
                    gutter, which made that one row 64px tall and broke the
                    even 40px rhythm the whole table depends on. */}
                <span className="hidden w-40 shrink-0 whitespace-nowrap text-muted-foreground/60 sm:block">
                  {item.years}
                </span>
                <span className="flex-1 truncate text-foreground">
                  {item.company}
                </span>
                <span className="shrink-0 whitespace-nowrap text-muted-foreground">
                  {item.role}
                </span>
              </motion.li>
            ))}
          </ul>
        </section>
      </main>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject !== null ? PROJECTS[selectedProject] : null}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

      {/* Footer */}
      {/* Budget: 1 size (12), 1 weight. Icons are 24px — one grid unit. */}
      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-2xl px-inset py-12">
          <div className="mb-8 flex justify-center gap-8">
            <FooterIcon href={X_URL} label="X">
              <XIcon className="h-6 w-6" />
            </FooterIcon>
            <FooterIcon href={GITHUB_URL} label="GitHub">
              <Github className="h-6 w-6" />
            </FooterIcon>
          </div>
          {/* Read the year rather than hardcoding it, so the footer doesn't
              quietly go stale every January. Safe to compute during render
              here: the `!isLoaded` gate above means the server only ever
              sends the spinner, so this footer is client-only and there's no
              build-year-vs-today mismatch to reconcile. If that gate ever
              goes away, this needs to move into an effect. */}
          <p className="type-micro text-center text-muted-foreground/60">
            © {new Date().getFullYear()} Alan Tom
          </p>
        </div>
      </footer>
    </motion.div>
  );
}

/* ───────────────────── Small presentational helpers ───────────────────── */

function Underline({
  children,
  href,
}: {
  children: React.ReactNode;
  href?: string;
}) {
  const className =
    "text-foreground/90 underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }
  return <span className={className}>{children}</span>;
}



function FooterIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </a>
  );
}

/* Brand logos (lucide has no X/Threads marks) — official glyphs as inline SVG */

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

