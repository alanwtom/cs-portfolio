"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "./components/theme-toggle";
import { useTheme } from "./components/theme-provider";
import { TypeWriter } from "./components/TypeWriter";
import { ProjectCard } from "./components/ProjectCard";
import dynamic from "next/dynamic";
import Image from "next/image";

import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import {
  PROJECTS,
  TYPEWRITER_TEXTS,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  ANIMATION_DURATIONS,
  ANIMATION_DELAYS,
  COPY_FEEDBACK_DURATION,
  TYPEWRITER_CONFIG,
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
  const { theme, setTheme, isLoaded } = useTheme();
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showJapanTooltip, setShowJapanTooltip] = useState(false);
  const [footerEmailRevealed, setFooterEmailRevealed] = useState(false);
  const [footerShowCopy, setFooterShowCopy] = useState(false);
  const [footerCopied, setFooterCopied] = useState(false);
  const footerCopyRef = React.useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Use our custom hooks
  const { getKeyboardShortcut } = useKeyboardShortcuts({
    onThemeToggle: () => setTheme(theme === "dark" ? "light" : "dark"),
    onEscapePress: () => {
      if (selectedProject !== null) {
        setSelectedProject(null);
      }
    },
    theme,
  });

  // Handle footer copy functionality
  React.useEffect(() => {
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

  // Remember last focused element and restore it when modal closes
  React.useEffect(() => {
    if (selectedProject !== null) {
      lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    } else if (lastFocusedRef.current) {
      lastFocusedRef.current.focus();
      lastFocusedRef.current = null;
    }
  }, [selectedProject]);

  // Show loading state while theme is being loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
      >
        Skip to main content
      </a>
      {/* Add a simple header with Japan emoji and theme toggle at the top */}
      <motion.div
        className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between"
        initial={reducedMotion ? false : { opacity: 0, y: -20 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reducedMotion ? undefined : { duration: 0.6, delay: 0.1 }}
      >
        {/* Japan emoji on the left */}
        <div className="flex items-center relative">
          <motion.span
            className="text-2xl align-middle cursor-pointer select-none"
            role="img"
            aria-label="Map of Japan"
            onMouseEnter={() => setShowJapanTooltip(true)}
            onMouseLeave={() => setShowJapanTooltip(false)}
            whileHover={
              reducedMotion
                ? undefined
                : {
                    scale: 1.15,
                    transition: {
                      duration: 0.08,
                      ease: "easeOut",
                    },
                  }
            }
            whileTap={
              reducedMotion
                ? undefined
                : {
                    scale: 0.9,
                    rotate: -5,
                    transition: {
                      type: "spring",
                      stiffness: 600,
                      damping: 15,
                    },
                  }
            }
          >
            🗾
          </motion.span>
          {/* Tooltip */}
          {showJapanTooltip && (
            <motion.div
              className={`absolute left-0 top-full mt-2 px-3 py-2 rounded-lg border shadow-sm text-sm whitespace-nowrap z-50 backdrop-blur-sm transition-all duration-500 ${
                theme === "dark"
                  ? "bg-[#0a1628]/90 border-[#1e293b]/60 text-slate-300"
                  : "bg-[#eaf1fb]/80 border-[#b6d0ee]/60 text-slate-600"
              }`}
              initial={reducedMotion ? false : { opacity: 0, y: -10 }}
              animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
              exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
              transition={reducedMotion ? undefined : { duration: 0.2 }}
            >
              my most recent trip was to Japan! I'd love to go back one day.
            </motion.div>
          )}
        </div>
        {/* Theme toggle on the right */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <span
            className={`text-xs px-2 py-1 rounded-md font-mono transition-colors duration-300 ${
              theme === "dark"
                ? "bg-slate-800 text-slate-400 border border-slate-700"
                : "bg-slate-100 text-slate-600 border border-slate-300"
            }`}
          >
            {getKeyboardShortcut()}
          </span>
        </div>
      </motion.div>

      {/* Profile Section (Avatar + Name + About Me) */}
      <motion.section
        id="main-content"
        className="max-w-3xl mx-auto px-6 py-10"
        initial={reducedMotion ? false : { opacity: 0, y: 30 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reducedMotion ? undefined : { duration: 0.8, delay: 0.2 }}
      >
        <Card
          className={`p-6 transition-all duration-500 backdrop-blur-sm ${
            theme === "dark"
              ? "bg-[#0a1628]/90 border-[#1e293b]/60"
              : "bg-[#eaf1fb]/80 border-[#b6d0ee]/60"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <motion.div
              className="w-28 h-28 rounded-full border-4 border-slate-200 dark:border-slate-800 shadow-md cursor-pointer overflow-hidden"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={
                reducedMotion ? undefined : { duration: 0.8, delay: 0.3 }
              }
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.08,
                      y: -4,
                      transition: {
                        duration: 0.08,
                        ease: "easeOut",
                      },
                    }
              }
              whileTap={
                reducedMotion
                  ? undefined
                  : {
                      scale: 0.98,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      },
                    }
              }
            >
              <Image
                src="/images/buttercup.jpg"
                alt="Alan Tom's profile photo"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
                sizes="112px"
              />
            </motion.div>
            <div className="flex-1 space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl font-light tracking-tight cursor-default"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reducedMotion ? undefined : { duration: 0.8, delay: 0.4 }
                }
              >
                Alan Tom
              </motion.h1>
              <motion.div
                className={`space-y-4 leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reducedMotion ? undefined : { duration: 0.8, delay: 0.5 }
                }
              >
                <TypeWriter
                  texts={TYPEWRITER_TEXTS}
                  speed={TYPEWRITER_CONFIG.SPEED}
                  pauseDuration={TYPEWRITER_CONFIG.PAUSE_DURATION}
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Experience Timeline Section */}
      <motion.section
        id="experience"
        className="max-w-3xl mx-auto px-6 py-10"
        initial={reducedMotion ? false : { opacity: 0, y: 30 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reducedMotion ? undefined : { duration: 0.8, delay: 0.8 }}
      >
        <motion.h2
          className="text-3xl font-light mb-10 cursor-default"
          initial={reducedMotion ? false : { opacity: 0, x: -20 }}
          animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          transition={reducedMotion ? undefined : { duration: 0.6, delay: 0.9 }}
        >
          Experience
        </motion.h2>
        <div className="relative pl-8">
          {/* Vertical line */}
          <motion.div
            className="absolute left-3 top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-700"
            style={{ zIndex: 0 }}
            initial={
              reducedMotion ? false : { scaleY: 0, transformOrigin: "top" }
            }
            animate={reducedMotion ? undefined : { scaleY: 1 }}
            transition={
              reducedMotion ? undefined : { duration: 1.0, delay: 1.0 }
            }
          />
          {/* Timeline items */}
          {[
            {
              color: "bg-blue-600",
              company: "iSchool at Syracuse University",
              title: "NSF REU Researcher",
              years: "2025 - Now",
              desc: "using NLP to analyze Trump's social media activities impact on the stock market",
            },
            {
              color: "bg-yellow-400",
              company: "Innovate Orange (CuseHacks)",
              title: "President",
              years: "2024 - Now",
              desc: "leading a team of 20+ students to organize Syracuse University's hackathons and datathons",
            },
            {
              color: "bg-green-600",
              company: "Micron Technology",
              title: "Software Development Engineer Intern",
              years: "2025 - 2025",
              desc: "developed an interactive UI for an educational semiconductor game",
            },
            {
              color: "bg-red-600",
              company: "Data Lab at Syracuse University",
              title: "Research Assistant",
              years: "2024 - 2025",
              desc: "compared LLM memory with human memory",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.company + item.title}
              className="flex items-start mb-10 last:mb-0 relative group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/60 rounded-md"
              style={{ zIndex: 1 }}
              tabIndex={0}
              initial={reducedMotion ? false : { opacity: 0, x: -30 }}
              animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
              transition={
                reducedMotion
                  ? undefined
                  : {
                      duration: 0.6,
                      delay: 1.1 + idx * 0.1,
                      layout: { duration: 0.15, ease: "easeOut" },
                      default: { duration: 0.15, ease: "easeOut" },
                    }
              }
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                      scale: 1.03,
                      y: -8,
                      backgroundColor:
                        theme === "dark"
                          ? "rgba(15, 23, 42, 0.6)"
                          : "rgba(248, 250, 252, 0.6)",
                      borderRadius: "8px",
                      boxShadow:
                        theme === "dark"
                          ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 25px 25px -10px rgba(0, 0, 0, 0.15)"
                          : "0 25px 50px -12px rgba(0, 0, 0, 0.08), 0 25px 25px -10px rgba(0, 0, 0, 0.04)",
                      transition: {
                        duration: 0.15,
                        ease: "easeOut",
                      },
                    }
              }
              whileTap={
                reducedMotion
                  ? undefined
                  : {
                      scale: 0.98,
                    }
              }
            >
              {/* Dot with glow on hover */}
              <motion.span
                className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${item.color}`}
                style={{ zIndex: 2 }}
                whileHover={{
                  scale: 1.25,
                  boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.2)",
                  transition: {
                    duration: 0.15,
                    ease: "easeOut",
                  },
                }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              />
              <div className="ml-8 flex-1 flex flex-row justify-between items-start">
                <div>
                  <span
                    className={`font-bold text-base md:text-lg transition-colors duration-300 ${
                      theme === "dark"
                        ? "group-hover:text-white group-focus:text-white"
                        : "group-hover:text-slate-900 group-focus:text-slate-900"
                    }`}
                  >
                    {item.company}
                  </span>
                  <div
                    className={`italic text-slate-500 dark:text-slate-300 text-base mb-1 transition-colors duration-300 ${
                      theme === "dark"
                        ? "group-hover:text-slate-200"
                        : "group-hover:text-slate-700"
                    }`}
                  >
                    {item.title}
                  </div>
                  <ul
                    className={`list-disc ml-5 text-slate-500 dark:text-slate-400 transition-colors duration-300 ${
                      theme === "dark"
                        ? "group-hover:text-slate-300"
                        : "group-hover:text-slate-700"
                    }`}
                  >
                    <li>{item.desc}</li>
                  </ul>
                </div>
                <span
                  className={`text-md text-slate-400 dark:text-slate-400 ml-4 whitespace-nowrap min-w-[90px] text-right pt-1 transition-colors duration-300 ${
                    theme === "dark"
                      ? "group-hover:text-white"
                      : "group-hover:text-slate-700"
                  }`}
                >
                  {item.years}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="max-w-3xl mx-auto px-6 py-10"
        initial={reducedMotion ? false : { opacity: 0, y: 30 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reducedMotion ? undefined : { duration: 0.8, delay: 1.6 }}
      >
        <div className="space-y-5">
          <motion.h2
            className="text-3xl font-light cursor-default"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.7 }}
          >
            Projects
          </motion.h2>
          <div className="flex flex-col gap-5">
            {PROJECTS.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index}
                onClick={() =>
                  setSelectedProject(selectedProject === index ? null : index)
                }
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject !== null ? PROJECTS[selectedProject] : null}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

      {/* Footer with contact icons and copyright */}
      <motion.footer
        className={`mt-10 py-6 transition-colors duration-300 text-center backdrop-blur-sm ${
          theme === "dark"
            ? "bg-black border-t border-[#222]"
            : "bg-[#eaf1fb]/80 border-t border-[#b6d0ee]/60"
        }`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2.5 }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center space-x-4 mb-4">
            {/* Contact icons */}
            <Button
              variant="ghost"
              size="sm"
              asChild={false}
              className={`transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  : "text-slate-600 hover:text-black hover:bg-slate-100"
              }`}
              onClick={() => {
                if (!footerEmailRevealed) {
                  setFooterEmailRevealed(true);
                } else if (!footerShowCopy) {
                  setFooterShowCopy(true);
                }
              }}
            >
              <span className="flex items-center relative">
                <Mail className="w-4 h-4 mr-2" />
                {footerEmailRevealed ? (
                  <>
                    <span className="underline decoration-dotted decoration-2 underline-offset-4 cursor-pointer">
                      {EMAIL}
                    </span>
                    {/* Copy popover */}
                    {footerShowCopy && (
                      <div
                        ref={footerCopyRef}
                        className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 rounded-xl shadow-lg px-2 py-1 text-xs font-medium transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-black text-white border border-slate-700"
                            : "bg-white text-black border border-slate-300"
                        }`}
                      >
                        {footerCopied ? (
                          <span className="text-green-400">Copied!</span>
                        ) : (
                          <div
                            role="button"
                            tabIndex={0}
                            className="inline-block px-1 py-0.5 hover:underline focus:outline-none cursor-pointer select-none font-normal transition-colors duration-150"
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await navigator.clipboard.writeText(EMAIL);
                                setFooterCopied(true);
                                setTimeout(() => {
                                  setFooterShowCopy(false);
                                  setFooterEmailRevealed(false);
                                  setFooterCopied(false);
                                }, COPY_FEEDBACK_DURATION);
                              } catch (err) {
                                // Fallback for older browsers or permission issues
                                console.warn("Failed to copy email:", err);
                                // You could show a fallback message here
                                setFooterCopied(true);
                                setTimeout(() => {
                                  setFooterShowCopy(false);
                                  setFooterEmailRevealed(false);
                                  setFooterCopied(false);
                                }, COPY_FEEDBACK_DURATION);
                              }
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                try {
                                  await navigator.clipboard.writeText(EMAIL);
                                  setFooterCopied(true);
                                  setTimeout(() => {
                                    setFooterShowCopy(false);
                                    setFooterEmailRevealed(false);
                                    setFooterCopied(false);
                                  }, COPY_FEEDBACK_DURATION);
                                } catch (err) {
                                  console.warn("Failed to copy email:", err);
                                  setFooterCopied(true);
                                  setTimeout(() => {
                                    setFooterShowCopy(false);
                                    setFooterEmailRevealed(false);
                                    setFooterCopied(false);
                                  }, COPY_FEEDBACK_DURATION);
                                }
                              }
                            }}
                          >
                            Copy Email
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <>Email</>
                )}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={`transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  : "text-slate-600 hover:text-black hover:bg-slate-100"
              }`}
            >
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={`transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  : "text-slate-600 hover:text-black hover:bg-slate-100"
              }`}
            >
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          </div>
          <p
            className={`text-xs mt-2 transition-colors duration-300 ${
              theme === "dark"
                ? "text-slate-500 hover:text-slate-400"
                : "text-slate-500 hover:text-slate-600"
            }`}
          >
            © 2025 Alan Tom. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
