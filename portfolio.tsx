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
  THREADS_URL,
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
              Currently building{" "}
              <Underline href="https://fwrdsms.com">FWRD</Underline>, a
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
          </motion.div>
        </section>

        <Divider />

        {/* ─────────────────────── Experience ─────────────────────── */}
        <section id="experience" className="scroll-mt-20 py-20 md:py-24">
          <SectionHeading title="Experience" />
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
          <SectionHeading title="Projects" />
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
          <SectionHeading title="University" />
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
      viewBox="0 0 192 192"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M141.537 88.988366C140.71 88.591934 139.87 88.210435 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.611 63.5455 90.6085 61.6931 97.2286 61.6931C97.3051 61.6931 97.3819 61.6931 97.4576 61.694C111.352 61.7824 118.89 68.9702 120.029 83.694C113.395 82.5658 106.226 82.2144 98.5601 82.6525C74.6936 84.0268 59.432 98.7311 60.4748 117.735C61.0118 127.516 65.8007 136.024 73.979 141.691C80.8544 146.474 89.8485 148.799 98.8438 148.272C110.532 147.604 119.83 142.788 126.388 134.034C131.46 127.355 134.679 118.611 136.142 107.337C141.274 110.43 145.092 114.491 147.276 119.364C150.927 127.512 151.141 140.922 140.801 151.232C131.684 160.301 120.607 164.258 104.342 164.376C86.2104 164.244 72.6289 158.415 63.0408 147.064C54.0791 136.474 49.4466 121.152 49.2886 101.524C49.4466 81.8958 54.0791 66.5737 63.0408 55.9837C72.6289 44.6331 86.2104 38.8036 104.342 38.672C122.661 38.8048 136.581 44.6712 146.428 56.2066C151.231 61.8593 154.832 69.5782 157.218 79.3415L173.398 75.0061C170.526 62.968 165.719 52.7694 158.982 44.7988C146.594 30.0546 128.447 22.6837 104.295 22.5C104.194 22.5 104.094 22.5 103.993 22.5005C79.8611 22.6358 61.9247 30.0977 49.5615 44.6426C38.3832 57.8486 32.6896 76.7451 32.5 101.493L32.5 101.555L32.5 101.617C32.6896 126.365 38.3832 145.262 49.5615 158.468C61.9247 173.013 79.8611 180.474 103.993 180.61C104.094 180.61 104.194 180.611 104.295 180.611C125.602 180.611 142.522 174.708 155.821 162.781C173.298 146.806 172.758 125.588 166.754 112.471C162.388 102.762 153.926 94.8647 141.537 88.988366ZM99.6054 131.389C89.5218 131.955 79.1329 127.343 78.6346 118.498C78.2618 111.79 83.4022 104.252 99.4175 103.342C100.719 103.268 101.996 103.232 103.25 103.232C108.594 103.232 113.493 103.749 117.847 104.755C116.137 126.081 107.473 130.886 99.6054 131.389Z" />
    </svg>
  );
}
