"use client";

import { Mail, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "./components/theme-toggle";
import { useTheme } from "./components/theme-provider";
import { TypeWriter } from "./components/TypeWriter";
import { ProjectCard } from "./components/ProjectCard";
import { Navbar } from "./components/Navbar";
import dynamic from "next/dynamic";
import Image from "next/image";

import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts";
import { useIsMobile } from "./hooks/use-mobile";
import {
  PROJECTS,
  TYPEWRITER_TEXTS,
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  COPY_FEEDBACK_DURATION,
  TYPEWRITER_CONFIG,
} from "./lib/constants";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "./hooks/use-reduced-motion";

// Lazy-load modal to reduce initial bundle size
const ProjectModal = dynamic(
  () => import("./components/ProjectModal").then((m) => m.ProjectModal),
  { ssr: false }
);

export default function Portfolio() {
  const { theme, setTheme, isLoaded } = useTheme();
  const [activeSection, setActiveSection] = useState("home");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [showJapanTooltip, setShowJapanTooltip] = useState(false);
  const [footerEmailRevealed, setFooterEmailRevealed] = useState(false);
  const [footerShowCopy, setFooterShowCopy] = useState(false);
  const [footerCopied, setFooterCopied] = useState(false);
  const footerCopyRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

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

  // Remember last focused element and restore it when modal closes
  useEffect(() => {
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300 flex flex-col bg-background text-foreground"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
      >
        Skip to main content
      </a>

      {/* Header */}
      <motion.div
        className="max-w-3xl mx-auto px-6 py-6 w-full flex items-center justify-between"
        initial={reducedMotion ? false : { opacity: 0, y: -20 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={reducedMotion ? undefined : { duration: 0.6, delay: 0.1 }}
      >
        {/* Japan emoji on the left */}
        <div className="flex items-center relative w-20">
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

        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          theme={theme}
        />

        {/* Theme toggle on the right */}
        <div className="flex items-center justify-end gap-2 w-20">
          <ThemeToggle />
          {!isMobile && (
            <span
              className={`text-xs px-2 py-1 rounded-md font-mono transition-colors duration-300 ${
                theme === "dark"
                  ? "bg-slate-800 text-slate-400 border border-slate-700"
                  : "bg-slate-100 text-slate-600 border border-slate-300"
              }`}
            >
              {getKeyboardShortcut()}
            </span>
          )}
        </div>
      </motion.div>

      <main id="main-content" className="flex-1 w-full max-w-3xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeSection === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
      {/* Profile Section (Avatar + Name + About Me) */}
              <div className="py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <motion.div
                    className="w-28 h-28 rounded-full border-2 border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer overflow-hidden"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
              animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
              transition={
                      reducedMotion ? undefined : { duration: 0.8, delay: 0.1 }
              }
              whileHover={
                reducedMotion
                  ? undefined
                  : {
                            scale: 1.05,
                      transition: {
                              duration: 0.2,
                        ease: "easeOut",
                      },
                    }
              }
              whileTap={
                reducedMotion
                  ? undefined
                  : {
                            scale: 0.95,
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      },
                    }
              }
            >
              <Image
                src={`/images/buttercup.jpg?v=${Date.now()}`}
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
                      className="text-4xl md:text-5xl font-bold tracking-tight cursor-default"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                        reducedMotion ? undefined : { duration: 0.8, delay: 0.2 }
                }
              >
                      Hi, I'm Alan.
              </motion.h1>
              <motion.div
                      className={`space-y-4 leading-relaxed text-lg ${
                        theme === "dark" ? "text-slate-300" : "text-slate-700"
                }`}
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                        reducedMotion ? undefined : { duration: 0.8, delay: 0.3 }
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
                
                <motion.div
                  className={`mt-8 space-y-6 leading-relaxed text-lg ${
                    theme === "dark" ? "text-slate-400" : "text-slate-600"
                  }`}
                  initial={reducedMotion ? false : { opacity: 0, y: 20 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    reducedMotion ? undefined : { duration: 0.8, delay: 0.4 }
                  }
      >
                  <div className="w-full h-px bg-slate-200 dark:bg-slate-800 my-8" />
                  
                  <p>
                    I currently serve as the President of <span className={theme === "dark" ? "text-white" : "text-black"}>Innovate Orange</span>, where I lead a team of 20+ students to organize Syracuse University's largest hackathons and datathons.
                  </p>
                  
                  <p>
                    Previously, I worked as a Software Development Engineer Intern at <span className={theme === "dark" ? "text-white" : "text-black"}>Micron Technology</span>, building data-driven UIs and caching systems for semiconductor simulations. I've also conducted research at Syracuse University's <span className={theme === "dark" ? "text-white" : "text-black"}>iSchool</span> and <span className={theme === "dark" ? "text-white" : "text-black"}>Data Lab</span>, exploring the intersection of LLMs, human memory, and financial market analysis.
                  </p>
                  
                  <p>
                    Outside of work, I love traveling, photography, and organizing tech communities to help students build cool things.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeSection === "experience" && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-6"
            >
              <h2 className="text-3xl font-light mb-10 cursor-default">Experience</h2>
        <div className="relative pl-8">
          {/* Vertical line */}
                <div
            className="absolute left-3 top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-700"
            style={{ zIndex: 0 }}
          />
          {/* Timeline items */}
          {[
            {
                    color: "bg-green-600",
                    company: "Micron Technology",
                    title: "Software Engineer Intern",
                    years: "Feb. 2025 - Present",
                    desc: "developing interactive C#/Unity simulations with 90% query reduction via custom caching and 60% UI overhead cut",
            },
            {
              color: "bg-yellow-400",
              company: "iSchool at Syracuse University",
              title: "NSF REU Researcher",
                    years: "June 2025 - Aug. 2025",
                    desc: "engineered financial sentiment pipeline using FinBERT/Llama 3.1, analyzing 5K+ posts to validatemarket volatility correlations",
            },
            {
              color: "bg-red-600",
              company: "Data Lab at Syracuse University",
                    title: "Undergraduate Researcher",
                    years: "Aug. 2024 - Feb. 2025",
                    desc: "built Python evaluation pipeline for LLM memory interference testing, automating analysis of 300+ associations",
            },
          ].map((item, idx) => (
            <motion.div
              key={item.company + item.title}
              className="flex items-start mb-10 last:mb-0 relative group cursor-pointer"
              tabIndex={0}
                    initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
              whileHover={{
                      x: 4,
                transition: {
                        duration: 0.2,
                  ease: "easeOut",
                },
              }}
            >
                    {/* Dot */}
              <motion.span
                className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${item.color}`}
                style={{ zIndex: 2 }}
                whileHover={{
                        scale: 1.2,
                        transition: { duration: 0.2 },
                }}
              />
                    <div className="ml-8 mr-1 md:mr-2 flex-1 flex flex-col md:flex-row justify-between items-start px-3 md:px-4">
                <div>
                  <span
                    className={`font-bold text-base md:text-lg transition-colors duration-300 ${
                            theme === "dark" ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {item.company}
                  </span>
                        <div className="italic text-slate-500 dark:text-slate-400 text-base mb-1">
                    {item.title}
                  </div>
                        <ul className="list-disc ml-5 text-slate-500 dark:text-slate-400 leading-relaxed">
                    <li>{item.desc}</li>
                  </ul>
                </div>
                      <span className="text-sm text-slate-400 dark:text-slate-500 whitespace-nowrap pt-1 md:text-right">
                  {item.years}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
            </motion.div>
          )}

          {activeSection === "projects" && (
            <motion.div
              key="projects"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-6"
            >
              <h2 className="text-3xl font-light mb-8 cursor-default">Projects</h2>
          <div className="flex flex-col gap-5">
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
            </motion.div>
          )}

          {activeSection === "university" && (
            <motion.div
              key="university"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="py-6"
            >
              <h2 className="text-3xl font-light mb-10 cursor-default">University</h2>
              
              <div className="space-y-12">
                {/* Education Header */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <h3 className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Syracuse University
                    </h3>
                    <p className={`text-lg ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                      Bachelor of Science in Computer Science
                    </p>
                  </div>
                  <div className={`text-right ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    <p>Expected May 2027</p>
                    <p>GPA: 3.7/4.0</p>
                    <p className="text-sm mt-1 italic">1870 Scholar (Full Tuition) & 4x Dean’s List</p>
                  </div>
                </div>

                {/* Coursework */}
                <div>
                  <h4 className={`text-lg font-medium mb-4 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Data Structures & Algorithms",
                      "Computer Architecture",
                      "Software Implementation",
                      "Operating Systems",
                      "Computer Networks",
                      "Virtual Reality",
                      "Linear Algebra",
                      "Probability & Statistics"
                    ].map((course) => (
                      <span
                        key={course}
                        className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                          theme === "dark"
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Activities */}
                <div>
                  <h4 className={`text-lg font-medium mb-4 ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                    Activities & Societies
                  </h4>
                  <div className={`space-y-6 ${theme === "dark" ? "text-slate-400" : "text-slate-600"}`}>
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <span className={`font-bold text-lg ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>
                          CuseHacks
                        </span>
                        <span className="text-sm italic">Feb. 2024 – Present</span>
                      </div>
                      <div className={`mb-1 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>President</div>
                      <ul className="list-disc ml-5 space-y-1">
                        <li>Led Syracuse University’s largest student-run hackathon with 200+ participants and a 15+ member organizing team</li>
                        <li>Grew attendance 40% YoY through local outreach, social media campaigns, and university partnerships</li>
                        <li>Secured $10,000+ in funding through industry partners and managing efforts across logistics, fundraising, and marketing</li>
                      </ul>
                    </div>
                    
                    <ul className="list-disc ml-5 space-y-2">
                      <li>
                        <span className={`font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>Association for Computing Machinery (ACM)</span> - Member
                      </li>
                      <li>
                        <span className={`font-medium ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>Engineering Ambassadors</span> - Mentor
                      </li>
                    </ul>
                  </div>
          </div>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject !== null ? PROJECTS[selectedProject] : null}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
      />

      <div className="max-w-3xl mx-auto px-6 w-full mt-auto">
        <hr className={`border-t ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`} />
      </div>

      {/* Footer with contact icons and copyright */}
      <motion.footer
        className={`py-10 transition-colors duration-300 text-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex justify-center space-x-8 mb-8">
            {/* Contact icons */}
            <div
              className={`cursor-pointer transition-colors duration-200 flex items-center ${
                theme === "dark"
                  ? "text-slate-500 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              onClick={() => {
                if (!footerEmailRevealed) {
                  setFooterEmailRevealed(true);
                } else if (!footerShowCopy) {
                  setFooterShowCopy(true);
                }
              }}
            >
              <Mail className="w-5 h-5 mr-2" />
                {footerEmailRevealed ? (
                <span className="relative">
                  <span className="underline decoration-dotted underline-offset-4">
                      {EMAIL}
                    </span>
                    {/* Copy popover */}
                    {footerShowCopy && (
                      <div
                        ref={footerCopyRef}
                      className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 rounded-lg shadow-sm px-2 py-1 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                          theme === "dark"
                          ? "bg-slate-800 text-white border border-slate-700"
                          : "bg-white text-black border border-slate-200"
                        }`}
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
                            }}
                          >
                            Copy Email
                          </div>
                        )}
                      </div>
                    )}
                </span>
                ) : (
                <span>Email</span>
                )}
            </div>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center transition-colors duration-200 ${
                theme === "dark"
                  ? "text-slate-500 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center transition-colors duration-200 ${
                theme === "dark"
                  ? "text-slate-500 hover:text-slate-300"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </a>
          </div>
          <p
            className={`text-sm transition-colors duration-300 ${
              theme === "dark"
                ? "text-slate-600"
                : "text-slate-400"
            }`}
          >
            © 2025 Alan Tom
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
