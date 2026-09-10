"use client";

import { Github } from "lucide-react";
import { ProjectCard } from "./components/ProjectCard";
import dynamic from "next/dynamic";

import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { PROJECTS, EXPERIENCES, GITHUB_URL, X_URL } from "./lib/constants";
import React, { useEffect, useRef, useState } from "react";

// Lazy-load modal to reduce initial bundle size
const ProjectModal = dynamic(
  () => import("./components/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false }
);

/**
 * The whole site.
 *
 * Budget: 2 of the 3 type classes (body and strong); the footer adds small.
 *
 * The shape of this markup is load-bearing. The intro is pure CSS keyed to
 * it — `.article > *` counts off at 50ms, then the sections restart at 0.45s
 * and 0.5s, then the footer at 0.55s — so the page has to be header +
 * paragraphs inside an article, then two sections, then a footer, in that
 * order. Reorder them and the cascade quietly loses its timing. The intro
 * block in globals.css is the other half of this file.
 *
 * This used to gate the whole page behind a theme-loading spinner, so the
 * server sent nothing but a spinner and real content appeared only once
 * JavaScript had run. With the theme gone the page renders on the server,
 * which is what lets a CSS intro start on the first paint rather than
 * waiting for hydration.
 */
export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useKeyboardShortcuts({
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

  return (
    <>
      <a
        href="#main-content"
        className="type-body sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 z-50 rounded-sm bg-primary px-4 py-2 text-primary-foreground"
      >
        Skip to main content
      </a>

      <main id="main-content" className="container-page stagger">
        {/* ── Article ──────────────────────────────────────────────
            Header, then paragraphs. No display type anywhere: the name
            is the same 14px as the copy beneath it and is set apart by
            weight alone, which is the whole idea. */}
        <article className="article">
          {/* Four separate blocks, not a <header> wrapper plus two
              paragraphs. The cascade counts direct children of .article, so
              wrapping the name and the line under it together made them
              arrive on the same beat and the intro barely counted off before
              the long pause. Split, they land 50ms apart like everything
              else. The spacing is unchanged — .subtitle drops the paragraph
              indent and carries the 8px itself. */}
          <h1 className="type-strong">Alan Tom</h1>

          <p className="subtitle type-body text-muted-foreground">
            Computer Science senior at Syracuse University
          </p>

          <p className="type-body">
            Currently building <Link href="https://fwrdsms.com">Fwrd</Link>, a
            privacy-forward iOS app that automatically forwards SMS to Discord,
            Slack, and Telegram.
          </p>

          <p className="type-body">
            Former Researcher at{" "}
            <Link href="https://ischool.syracuse.edu/summer-paid-research-experience/">
              iSchool NSF REU
            </Link>
            , and President of{" "}
            <Link href="https://cusehacks.com">CuseHacks</Link>.
          </p>
        </article>

        {/* ── Projects ─────────────────────────────────────────────
            An index, not cards. The section label is body copy at 40%
            black rather than a heading — nothing on this page is set
            larger than anything else. */}
        <section className="pt-12">
          <h2 className="type-body pb-2 text-muted-foreground">Projects</h2>
          <ul className="index-list">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                onClick={() =>
                  setSelectedProject(selectedProject === index ? null : index)
                }
              />
            ))}
          </ul>
        </section>

        {/* ── Experience ───────────────────────────────────────────
            The same row as Projects, minus the modal. Role and
            description are still in constants.ts but aren't rendered. */}
        <section className="pt-12">
          <h2 className="type-body pb-2 text-muted-foreground">Experience</h2>
          <ul className="index-list">
            {EXPERIENCES.map((item) => (
              <li key={item.company + item.role}>
                <div className="index-row">
                  <span className="flex-1 truncate">{item.company}</span>
                  <span className="type-small shrink-0 whitespace-nowrap text-muted-foreground">
                    {item.years}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <footer className="pt-10 pb-20">
          <div className="flex items-center gap-4 pb-2">
            <FooterIcon href={X_URL} label="X">
              <XIcon className="h-4 w-4" />
            </FooterIcon>
            <FooterIcon href={GITHUB_URL} label="GitHub">
              <Github className="h-4 w-4" />
            </FooterIcon>
          </div>
          {/* Read the year rather than hardcoding it, so this doesn't go
              stale every January. The page is prerendered, so the year is
              baked at build time and someone loading it after New Year
              would otherwise trip a hydration mismatch on this one line. */}
          <p
            className="type-small text-muted-foreground"
            suppressHydrationWarning
          >
            © {new Date().getFullYear()} Alan Tom
          </p>
        </footer>
      </main>

      <ProjectModal
        project={selectedProject !== null ? PROJECTS[selectedProject] : null}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}

/* ───────────────────── Small presentational helpers ───────────────────── */

/**
 * A hairline rule under the text rather than `text-decoration`, so it clears
 * the descenders instead of cutting through them. Styled in globals.css.
 */
function Link({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="link">
      {children}
    </a>
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

/* Brand logo (lucide has no X mark) — official glyph as inline SVG */

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
