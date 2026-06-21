"use client";

import { Github } from "lucide-react";
import { useTheme } from "./components/theme-provider";
import { ProjectCard } from "./components/ProjectCard";
import { ScrollProgress } from "./components/ScrollProgress";
import { SectionHeading } from "./components/SectionHeading";
import dynamic from "next/dynamic";
import Image from "next/image";

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

const SCROLL_SECTIONS = [
  { id: "hero", label: "Intro" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
];

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
      <ScrollProgress sections={SCROLL_SECTIONS} />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all duration-200"
      >
        Skip to main content
      </a>

      {/* Top progress bar is gone; sidebar rail handles section nav */}

      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl flex-1 px-6"
      >
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section id="hero" className="scroll-mt-20 pt-20 pb-12 md:pt-28 md:pb-16">
          <div className="flex flex-row items-start justify-between gap-8">
            <div className="flex-1 space-y-5">
              <h1 className="text-4xl font-medium tracking-tight text-foreground md:text-5xl">
                Alan Tom
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Computer Science senior at Syracuse University
              </p>
            </div>

            <div className="aspect-square h-24 w-24 shrink-0 overflow-hidden border border-border shadow-sm md:h-28 md:w-28">
              <Image
                src={`/images/buttercup_1.webp?v=${Date.now()}`}
                alt="Alan Tom's profile photo"
                width={112}
                height={112}
                className="h-full w-full object-cover"
                priority
                sizes="112px"
              />
            </div>
          </div>

          <div className="mt-6 max-w-xl space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Currently building{" "}
              <Underline href="https://fwrdsms.com">Fwrd</Underline>, a
              privacy-first iOS app that forwards SMS to Discord, Slack, and
              Telegram.
            </p>
            <p>
              Former Researcher at{" "}
              <Underline href="https://ischool.syracuse.edu/summer-paid-research-experience/">
                iSchool NSF REU
              </Underline>
              , and President of{" "}
              <Underline href="https://cusehacks.com">Innovate Orange</Underline>
              .
            </p>
          </div>
        </section>

        {/* ───────────────────────── Projects ───────────────────── */}
        <section id="projects" className="scroll-mt-20 py-16 md:py-20">
          <SectionHeading title="Projects" />
          <div className="flex flex-col gap-4">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                onClick={() =>
                  setSelectedProject(
                    selectedProject === index ? null : index
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* ─────────────────────── Experience ─────────────────────── */}
        <section id="experience" className="scroll-mt-20 py-16 md:py-20">
          <SectionHeading title="Experience" />
          <div className="flex flex-col gap-4">
            {EXPERIENCES.map((item, idx) => (
              <motion.div
                key={item.company + item.role}
                className="group relative flex flex-col gap-1 rounded-lg px-4 py-4 -mx-4 transition-all duration-300 hover:bg-secondary/40 md:flex-row md:items-baseline md:justify-between md:gap-8"
                initial={reduced ? false : { opacity: 0 }}
                whileInView={reduced ? undefined : { opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="flex-1">
                  <h3 className="text-lg font-medium leading-relaxed text-foreground">
                    {item.company}{" "}
                    <span className="text-base italic font-normal text-muted-foreground">
                      {item.role}
                    </span>
                  </h3>
                  <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-sm text-muted-foreground/70 md:text-right">
                  {item.years}
                </span>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject !== null ? PROJECTS[selectedProject] : null}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-2xl px-6 py-10">
          <div className="mb-8 flex justify-center gap-8">
            <FooterIcon href={X_URL} label="X">
              <XIcon className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href={GITHUB_URL} label="GitHub">
              <Github className="h-5 w-5" />
            </FooterIcon>
          </div>
          <p className="text-center text-xs text-muted-foreground/60">
            © 2025 Alan Tom
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

