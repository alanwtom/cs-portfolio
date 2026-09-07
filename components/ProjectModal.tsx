"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight } from "lucide-react";
import type { Project } from "@/lib/constants";
import { useEffect } from "react";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Project detail sheet.
 *
 * Budget: 3 sizes (24 / 16 / 12), 2 weights (500 for the title, labels and
 * tech names; 400 for prose).
 *
 * Structure, top to bottom: a 24px-radius panel with 24px of safe space, then
 * four content groups — header, description, tech stack, features, actions —
 * separated by 32px. Inside a group, related lines sit 8px apart. That gap
 * difference (32 between groups, 8 within) is the whole grouping story; no
 * dividers needed.
 *
 * This used to hardcode slate colours and branch on the theme by hand. It now
 * reads the same palette tokens as the rest of the site, so light and dark
 * both follow from one place.
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
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-inset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={project.title}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-border bg-card p-inset text-card-foreground shadow-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
                duration: 0.4,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-8">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <motion.h2
                    className="type-title text-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {project.title}
                  </motion.h2>
                  {/* 32px control on an 8px radius — the control corner, not
                      the surface one. */}
                  <motion.button
                    onClick={onClose}
                    className="type-body flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
                    aria-label="Close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    /* Motion already grows this on hover, just below. The class
                       list used to *also* say `hover:scale-110` with
                       `transition-all`, which fought the entry animation over
                       both opacity and transform — and the CSS scale never took
                       effect anyway, because Motion writes an inline transform
                       that overrides Tailwind's. */
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                {/* Description */}
                <motion.p
                  className="type-body text-muted-foreground"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {project.detailedDescription}
                </motion.p>

                {/* Tech Stack */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <h3 className="type-micro text-muted-foreground/70">
                    Tech Stack
                  </h3>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    {Object.entries(project.techStack).map(
                      ([tech, description], index) => (
                        <motion.div
                          key={tech}
                          className="space-y-2 rounded-md border border-border bg-secondary/40 p-inset-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.3 + index * 0.05,
                            duration: 0.3,
                          }}
                        >
                          <div className="type-body-strong text-foreground">
                            {tech}
                          </div>
                          <div className="type-body text-muted-foreground">
                            {description}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <h3 className="type-micro text-muted-foreground/70">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className="type-body flex items-start gap-2 text-muted-foreground"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          duration: 0.3,
                        }}
                      >
                        {/* Bullet sits in a 24px box so it lands on the first
                            line's baseline grid instead of being nudged. */}
                        <span
                          aria-hidden="true"
                          className="flex h-6 w-2 shrink-0 items-center text-muted-foreground/50"
                        >
                          •
                        </span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col gap-2 sm:flex-row"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {project.github && (
                    <Button asChild className="flex-1">
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
                  <Button asChild variant="outline" className="flex-1">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                      Live Demo
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
