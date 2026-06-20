"use client";

import { Mail, Github } from "lucide-react";
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
  EMAIL,
  GITHUB_URL,
  X_URL,
  THREADS_URL,
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
  const { isLoaded } = useTheme();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [footerEmailRevealed, setFooterEmailRevealed] = useState(false);
  const [footerShowCopy, setFooterShowCopy] = useState(false);
  const [footerCopied, setFooterCopied] = useState(false);
  const footerCopyRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const reduced = useReducedMotion();

  useKeyboardShortcuts({
    onThemeToggle: () => {},
    onEscapePress: () => {
      if (selectedProject !== null) setSelectedProject(null);
    },
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

      {/* Top progress bar is gone; sidebar rail handles section nav */}

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
                Alan Tom
              </motion.h1>
              <motion.p
                className="text-lg leading-relaxed text-muted-foreground"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                Computer Science senior at Syracuse University
              </motion.p>
            </div>
          </div>

          <motion.div
            className="mt-12 max-w-xl space-y-5 text-lg leading-relaxed text-muted-foreground"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <p>
              SDE Intern at <Underline>Micron Technology</Underline>, building
              data-driven UIs and caching for semiconductor simulations.
            </p>
            <p>
              Former President of <Underline>Innovate Orange</Underline>, where
              I led 20+ students running Syracuse&apos;s largest hackathons and
              datathons.
            </p>
            <p>
              Previously researched LLMs, human memory, and financial markets at
              the <Underline>iSchool</Underline> and{" "}
              <Underline>Data Lab</Underline>.
            </p>
            <p>Outside of work, I play video games, travel, and work out.</p>
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
                    <h3 className="text-lg font-medium text-foreground">
                      {item.company}
                    </h3>
                    <span className="text-base italic text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
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
                <p className="mt-1 text-base text-muted-foreground">
                  Former President, Syracuse University&apos;s largest
                  student-run hackathon
                </p>
              </div>
              <div className="shrink-0 text-left text-sm text-muted-foreground/70 md:text-right">
                <p>Feb. 2024 – May 2025</p>
                <p className="italic">200+ participants annually</p>
              </div>
            </div>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Led the entire event lifecycle—team building, finance, logistics,
              and outreach—to deliver a flagship experience for Syracuse
              University creatives and engineers.
            </p>

            <ul className="mt-4 space-y-2 text-base text-muted-foreground">
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
            <FooterIcon href={X_URL} label="X">
              <XIcon className="h-5 w-5" />
            </FooterIcon>
            <FooterIcon href={THREADS_URL} label="Threads">
              <ThreadsIcon className="h-5 w-5" />
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

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.461-.218-3.454-.775-1.182-.66-1.868-1.715-1.884-2.886-.017-1.208.623-2.272 1.753-2.918 1.085-.622 2.57-.953 4.418-.982.575-.009 1.118.014 1.626.066-.062-.94-.273-1.6-.63-2.037-.488-.583-1.243-.88-2.247-.888h-.025c-.81 0-1.91.221-2.605 1.274l-1.728-1.155c.94-1.408 2.479-2.179 4.339-2.179h.037c3.083.018 4.918 1.964 5.095 5.376.105.045.208.092.31.142 1.45.668 2.51 1.74 3.056 3.1.702 1.775.784 4.684-1.519 6.943-1.79 1.753-4.09 2.526-7.083 2.55zm1.348-8.49c-.326-.058-.7-.086-1.118-.086-.06 0-.12 0-.182.002-2.273.037-3.722.612-3.756 1.862-.026.95.936 1.442 1.794 1.488 1.666.09 3.472-.764 3.578-3.444.016-.41.015-.8-.061-1.15-.102.014-.207.027-.315.027z" />
    </svg>
  );
}
