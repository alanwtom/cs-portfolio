"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Github, ArrowUpRight, X } from "lucide-react";
import { ASSET_VERSION, type Project } from "@/lib/constants";
import { TechIcon } from "./TechIcon";
import { ProjectCover } from "./ProjectCover";
import { useEffect } from "react";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

/*
  Sharp, slightly expensive-feeling ease, borrowed from Sequel's system.
  Deliberately not a spring: a spring makes a big panel feel bouncy and
  cheap at this size, and the overshoot fights the scrim fading in.
*/
const EASE: [number, number, number, number] = [0.625, 0.05, 0, 1];

/**
 * Project detail sheet.
 *
 * Budget: 3 sizes (40/48 display, 16 body, 12 micro), 2 weights (500, 400).
 *
 * The shape of this thing is the point. The previous version was a padded
 * box with a small framed screenshot inside it, then three labelled
 * sections underneath, which is the layout every AI-built modal converges
 * on and it reads as filler. Three borrowed rules fixed it:
 *
 *  - Editorial project cards run their media FULL BLEED: no internal
 *    padding, no border, no shadow. So the panel itself carries no padding;
 *    the snapshot goes edge to edge and inherits the panel's own 24px top
 *    corners, and only the copy below is inset.
 *  - Depth comes from hairline borders and extreme type-scale contrast,
 *    never from shadows. Hence a 48px title against 16px body and 12px
 *    labels, and highlights separated by 1px rules instead of bullets.
 *  - Never put text on raw photography without a gradient scrim. The title
 *    sits over the snapshot on a black scrim, which is also why
 *    ProjectCover is dark in both themes.
 *
 * Still on the 8px grid: 24px inset for copy, 32px between groups, 8px
 * within one.
 */
export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-inset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={onClose}
          >
            {/* No padding on the panel: the snapshot has to reach its edges.
                The copy below carries its own 24px inset instead. */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={project.title}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card text-card-foreground"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Snapshot, full bleed, title over a scrim ──────────── */}
              <div className="relative overflow-hidden rounded-t-lg">
                {project.shot ? (
                  <div className="relative aspect-[2/1] w-full bg-[#0a0a0a]">
                    <Image
                      src={`/images/projects/${project.shot}?v=${ASSET_VERSION}`}
                      alt={`${project.title} screenshot`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 672px"
                      priority
                    />
                  </div>
                ) : (
                  <ProjectCover tech={project.tech} title={project.title} />
                )}

                {/* Scrim. Without this the title sits on raw screenshot and
                    becomes unreadable the moment the image is busy, which
                    Current's app UI very much is. */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/55 to-transparent"
                />

                <motion.h2
                  className="type-display absolute bottom-0 left-0 p-inset text-white"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3, ease: EASE }}
                >
                  {project.title}
                </motion.h2>

                {/* Frosted glass, which works here because there is actually
                    an image behind it to blur. 32px control, 8px radius. */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-sm border border-white/15 bg-black/40 text-white backdrop-blur-md transition-colors duration-200 hover:bg-black/70"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-8 p-inset">
                {/* ── One-line summary ───────────────────────────────── */}
                <motion.p
                  className="type-body text-muted-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.14, duration: 0.3, ease: EASE }}
                >
                  {project.detailedDescription}
                </motion.p>

                {/* ── Tech stack, as marks ───────────────────────────────
                    32px tall chips with the inset top highlight that reads
                    as a lit edge on dark. Invisible in light mode, which is
                    correct: there is nothing to catch the light there. */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.3, ease: EASE }}
                >
                  <h3 className="type-micro text-muted-foreground/70">
                    Built with
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, i) => (
                      <motion.span
                        key={tech}
                        className="type-micro flex h-8 items-center gap-2 rounded-sm border border-border bg-secondary/60 px-2 text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.18 + i * 0.03,
                          duration: 0.25,
                          ease: EASE,
                        }}
                      >
                        <TechIcon name={tech} />
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* ── Highlights, as a hairline spec sheet ───────────────
                    Rules instead of bullet glyphs. Reads like a spec table,
                    which suits an engineering portfolio, and it survives
                    any number of items without orphan dividers. */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.3, ease: EASE }}
                >
                  <h3 className="type-micro text-muted-foreground/70">
                    Highlights
                  </h3>
                  <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                    {project.features.map((feature, i) => (
                      <motion.li
                        key={feature}
                        className="type-body border-t border-border py-2 text-muted-foreground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          delay: 0.22 + i * 0.03,
                          duration: 0.25,
                          ease: EASE,
                        }}
                      >
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* ── Actions ───────────────────────────────────────────── */}
                <motion.div
                  className="flex flex-col gap-2 sm:flex-row"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.3, ease: EASE }}
                >
                  <Button asChild className="flex-1">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                  {project.github && (
                    <Button asChild variant="outline" className="flex-1">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
