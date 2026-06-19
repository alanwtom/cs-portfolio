"use client";

import { Mail, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "./components/theme-toggle";
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
  TYPEWRITER_TEXTS,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  COPY_FEEDBACK_DURATION,
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
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "university", label: "University" },
];

export default function Portfolio() {
  const { theme, setTheme, isLoaded } = useTheme();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [footerEmailRevealed, setFooterEmailRevealed] = useState(false);
  const [footerShowCopy, setFooterShowCopy] = useState(false);
  const [footerCopied, setFooterCopied] = useState(false);
  const footerCopyRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  const { getKeyboardShortcut } = useKeyboardShortcuts({
    onThemeToggle: () => setTheme(theme === "dark" ? "light" : "dark"),
    onEscapePress: () => {
      if (selectedProject !== null) setSelectedProject(null);
    },
    theme,
  });

  // Close the footer email copy popover on outside click.
  useEffect(() => {
    if (!footerShowCopy) return;
    function handleClick(e: MouseEvent) {
      if (
        footerCopyRef.current &&
        e.target instanceof Node &&
        !footerCopyRef.current.contains(e.target as Node)
      ) {
        setFooterShowCopy(false);
        setFooterEmailRevealed(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [footerShowCopy]);

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

  const revealEmail = () => {
    if (!footerEmailRevealed) setFooterEmailRevealed(true);
    else if (!footerShowCopy) setFooterShowCopy(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setFooterEmailRevealed(true);
      setFooterShowCopy(true);
      setFooterCopied(true);
      setTimeout(() => {
        setFooterShowCopy(false);
        setFooterEmailRevealed(false);
        setFooterCopied(false);
      }, COPY_FEEDBACK_DURATION);
    } catch (err) {
      console.warn("Failed to copy email:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
      <ScrollProgress sections={SCROLL_SECTIONS} />

      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-all duration-200"
      >
        Skip to main content
      </a>

      {/* Top bar */}
      <motion.header
        className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md"
        initial={reduced ? false : { opacity: 0, y: -12 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between px-6 py-4">
          <a
            href="#hero"
            className="text-sm font-medium tracking-tight text-foreground transition-colors hover:text-muted-foreground"
          >
            alan tom
          </a>
          <div className="flex items-center gap-2">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              github
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden text-xs text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              linkedin
            </a>
            <kbd
              className="hidden shrink-0 select-none rounded border border-border bg-secondary/40 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block"
              title={`Press ${getKeyboardShortcut()} to toggle theme`}
            >
              {getKeyboardShortcut()}
            </kbd>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-2xl flex-1 px-6"
      >
        {/* ───────────────────────── Hero ───────────────────────── */}
        <section id="hero" className="scroll-mt-20 py-20 md:py-28">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <motion.div
              className="h-24 w-24 shrink-0 overflow-hidden rounded-full border border-border shadow-sm"
              initial={reduced ? false : { opacity: 0, scale: 0.85 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Image
                src={`/images/buttercup_1.webp?v=${Date.now()}`}
                alt="Alan Tom's profile photo"
                width={96}
                height={96}
                className="h-full w-full object-cover"
                priority
                sizes="96px"
              />
            </motion.div>

            <div className="flex-1 space-y-5">
              <motion.h1
                className="text-4xl font-medium tracking-tight text-foreground md:text-5xl"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                Hi, I&apos;m Alan.
              </motion.h1>
              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                {TYPEWRITER_TEXTS[0]}
              </motion.p>
            </div>
          </div>

          <motion.div
            className="mt-12 max-w-xl space-y-5 text-[15px] leading-relaxed text-muted-foreground"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p>
              I currently work as a Software Development Engineer Intern at{" "}
              <Underline>Micron Technology</Underline>, building data-driven UIs
              and caching systems for semiconductor simulations.
            </p>
            <p>
              I also serve as the President of{" "}
              <Underline>Innovate Orange</Underline>, where I lead a team of 20+
              students to organize Syracuse University&apos;s largest hackathons
              and datathons.
            </p>
            <p>
              Previously, I conducted research at Syracuse University&apos;s{" "}
              <Underline>iSchool</Underline> and <Underline>Data Lab</Underline>,
              exploring the intersection of LLMs, human memory, and financial
              market analysis.
            </p>
            <p>Outside of work, I play video games, travel, and work out!</p>
          </motion.div>
        </section>

        <Divider />

        {/* ─────────────────────── Experience ─────────────────────── */}
        <section id="experience" className="scroll-mt-20 py-20 md:py-24">
          <SectionHeading index="01 — Experience" title="Experience" />
          <div className="flex flex-col">
            {EXPERIENCES.map((item, idx) => (
              <motion.div
                key={item.company + item.role}
                className="group relative flex flex-col gap-1 border-t border-border py-6 first:border-t-0 md:flex-row md:items-baseline md:justify-between md:gap-8"
                initial={reduced ? false : { opacity: 0, y: 12 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-base font-medium text-foreground">
                      {item.company}
                    </h3>
                    <span className="text-sm italic text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground/70 md:text-right">
                  {item.years}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        <Divider />

        {/* ───────────────────────── Projects ───────────────────── */}
        <section id="projects" className="scroll-mt-20 py-20 md:py-24">
          <SectionHeading index="02 — Projects" title="Projects" />
          <div className="flex flex-col">
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

        <Divider />

        {/* ─────────────────────── University ────────────────────── */}
        <section id="university" className="scroll-mt-20 py-20 md:py-24">
          <SectionHeading index="03 — University" title="University" />
          <div className="rounded-lg border border-border bg-card/40 p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-medium text-foreground">
                  CuseHacks
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  President, Syracuse University&apos;s largest student-run
                  hackathon
                </p>
              </div>
              <div className="shrink-0 text-left text-xs text-muted-foreground/70 md:text-right">
                <p>Feb. 2024 – Present</p>
                <p className="italic">200+ participants annually</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Lead the entire event lifecycle—team building, finance, logistics,
              and outreach—to deliver a flagship experience for Syracuse
              University creatives and engineers.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <Bullet>
                Orchestrated a 40% YoY growth in attendance through targeted
                outreach and partnerships.
              </Bullet>
              <Bullet>
                Secured $10,000+ in industry sponsorships while managing a 15+
                member leadership council.
              </Bullet>
              <Bullet>
                Balanced operations across logistics, fundraising, and marketing
                to keep the hackathon on-brand and sustainable.
              </Bullet>
            </ul>
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
            <FooterIcon href={LINKEDIN_URL} label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href={GITHUB_URL} label="GitHub">
              <Github className="h-5 w-5" />
            </FooterIcon>

            <div
              className="flex cursor-pointer items-center text-muted-foreground transition-colors hover:text-foreground"
              onClick={revealEmail}
              onDoubleClick={async (e) => {
                e.stopPropagation();
                await copyEmail();
              }}
            >
              <Mail className="h-5 w-5" />
              {footerEmailRevealed && (
                <span className="relative ml-2">
                  <span className="underline decoration-dotted underline-offset-4">
                    {EMAIL}
                  </span>
                  {footerShowCopy && (
                    <div
                      ref={footerCopyRef}
                      className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-sm transition-all duration-200"
                    >
                      {footerCopied ? (
                        <span className="text-green-500">Copied!</span>
                      ) : (
                        <div
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await copyEmail();
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              await copyEmail();
                            }
                          }}
                        >
                          Copy Email
                        </div>
                      )}
                    </div>
                  )}
                </span>
              )}
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground/60">
            © 2025 Alan Tom
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ───────────────────── Small presentational helpers ───────────────────── */

function Underline({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-foreground/90 underline decoration-border underline-offset-4">
      {children}
    </span>
  );
}

function Divider() {
  return <div className="h-px w-full bg-border" aria-hidden="true" />;
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
      <span>{children}</span>
    </li>
  );
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
