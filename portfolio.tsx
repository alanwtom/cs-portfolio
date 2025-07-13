"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Github, Linkedin, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./components/theme-toggle";
import { ProjectCard } from "./components/project-card";
import { SkillBadge } from "./components/skill-badge";
import { useTheme } from "./components/theme-provider";
import React, { useRef, useState, useEffect } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

export default function Portfolio() {
  const { theme, setTheme } = useTheme();
  const [emailRevealed, setEmailRevealed] = useState(false);
  const emailHoldTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showCopyBubble, setShowCopyBubble] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyBubbleRef = useRef<HTMLDivElement | null>(null);
  const [footerEmailRevealed, setFooterEmailRevealed] = useState(false);
  const [footerShowCopy, setFooterShowCopy] = useState(false);
  const [footerCopied, setFooterCopied] = useState(false);
  const footerCopyRef = useRef<HTMLDivElement | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const projects = [
    {
      title: "Bug Bot",
      description:
        "discord bot for career development with resume resources, real time job and event tracking, and learning material recommendations",
      tech: ["Python", "Discord.py", "GCP", "Nox"],
      github: "https://github.com/innovateorange/DiscordBot",
      demo: "https://discord.gg/cvqbKxPtHE",
      detailedDescription:
        "student-focused career development bot with real-time job tracking, resume resources, and personalized learning recommendations",
      techStack: {
        Python: "core bot development",
        "Discord.py": "discord API integration",
        GCP: "cloud hosting & storage",
        Nox: "testing & automation",
      },
      features: [
        "real-time job and event tracking",
        "resume building resources and templates",
        "personalized learning material recommendations",
        "career development guidance and tips",
      ],
    },
    {
      title: "Flow",
      description:
        "sleek browser extension that helps users maintain focus by blocking distracting elements while browsing",
      tech: ["JavaScript", "Chrome Extension API", "HTML", "CSS"],
      github: "https://github.com/alantomw/Flow",
      demo: "https://chromewebstore.google.com/detail/flow/odenofhkafaeedoohodgdndpeeadpndg",
      detailedDescription:
        "browser extension that helps users maintain focus by intelligently blocking distracting elements while preserving core functionality",
      techStack: {
        JavaScript: "core extension logic",
        "Chrome Extension API": "browser integration",
        HTML: "popup interface structure",
        CSS: "styling & user interface",
      },
      features: [
        "intelligent content blocking algorithms",
        "customizable distraction filters",
        "minimal performance impact",
        "seamless user experience",
      ],
    },
  ];

  useEffect(() => {
    if (!showCopyBubble) return;
    function handleClick(e: MouseEvent) {
      if (
        copyBubbleRef.current &&
        e.target instanceof Node &&
        !copyBubbleRef.current.contains(e.target as Node)
      ) {
        setShowCopyBubble(false);
      }
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [showCopyBubble]);

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

  // Keyboard shortcut for theme toggle
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [theme, setTheme]);

  // Keyboard shortcut for closing modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && selectedProject !== null) {
        setSelectedProject(null);
        // Remove focus from any focused element to prevent outline
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Add a simple header with Japan emoji and theme toggle at the top */}
      <motion.div
        className="max-w-3xl mx-auto px-6 py-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Japan emoji on the left */}
        <div className="flex items-center">
          <motion.span
            className="text-2xl align-middle cursor-pointer"
            role="img"
            aria-label="Map of Japan"
            whileHover={{
              scale: 1.15,
              rotate: 15,
              transition: {
                duration: 0.08,
                ease: "easeOut",
              },
            }}
            whileTap={{
              scale: 0.9,
              rotate: -5,
              transition: {
                type: "spring",
                stiffness: 600,
                damping: 15,
              },
            }}
          >
            🗾
          </motion.span>
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
            ⌘ L
          </span>
        </div>
      </motion.div>

      {/* Profile Section (Avatar + Name + About Me) */}
      <motion.section
        id="about"
        className="max-w-3xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
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
            <motion.img
              src="/images/buttercup.jpg"
              alt="Profile avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 dark:border-slate-800 shadow-md cursor-pointer"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{
                scale: 1.08,
                y: -4,
                transition: {
                  duration: 0.08,
                  ease: "easeOut",
                },
              }}
              whileTap={{
                scale: 0.98,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                },
              }}
            />
            <div className="flex-1 space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl font-light tracking-tight cursor-default"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Alan Tom
              </motion.h1>
              <motion.div
                className={`space-y-4 leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <p
                  className={`transition-colors duration-300 ${
                    theme === "dark"
                      ? "hover:text-slate-200"
                      : "hover:text-slate-800"
                  }`}
                >
                  I'm a computer science junior at Syracuse University. In my
                  free time, I lead CuseHacks, a student-run hackathon, and try
                  to travel as much as possible.
                </p>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.section>

      {/* Experience Timeline Section */}
      <motion.section
        id="experience"
        className="max-w-3xl mx-auto px-6 py-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.h2
          className="text-3xl font-light mb-10 cursor-default"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          Experience
        </motion.h2>
        <div className="relative pl-8">
          {/* Vertical line */}
          <motion.div
            className="absolute left-3 top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-700"
            style={{ zIndex: 0 }}
            initial={{ scaleY: 0, transformOrigin: "top" }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.0, delay: 1.0 }}
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
              className="flex items-start mb-10 last:mb-0 relative group cursor-pointer"
              style={{ zIndex: 1 }}
              tabIndex={0}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 1.1 + idx * 0.1,
                layout: { duration: 0.15, ease: "easeOut" },
                default: { duration: 0.15, ease: "easeOut" },
              }}
              whileHover={{
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
              }}
              whileTap={{
                scale: 0.98,
              }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
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
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                className="flex flex-row justify-between items-start w-full group cursor-pointer relative"
                tabIndex={0}
                onClick={() =>
                  setSelectedProject(selectedProject === index ? null : index)
                }
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.8 + index * 0.1,
                  layout: { duration: 0.15, ease: "easeOut" },
                  default: { duration: 0.15, ease: "easeOut" },
                }}
                whileHover={{
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
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <div className="flex-1 min-w-0">
                  <span
                    className={`font-bold text-base md:text-lg transition-colors duration-300 ${
                      theme === "dark"
                        ? "group-hover:text-white group-focus:text-white"
                        : "group-hover:text-slate-900 group-focus:text-slate-900"
                    }`}
                  >
                    {project.title}
                  </span>
                  <div
                    className={`mt-1 text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl transition-colors duration-300 ${
                      theme === "dark"
                        ? "group-hover:text-slate-200"
                        : "group-hover:text-slate-700"
                    }`}
                  >
                    {project.description}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-6 mt-1 justify-end min-w-[120px]">
                  {project.tech.map((tech, i) => (
                    <motion.span
                      key={tech}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow ${
                        tech.toLowerCase() === "gcp"
                          ? "bg-blue-600 text-white"
                          : tech.toLowerCase() === "python"
                          ? "bg-yellow-300 text-black"
                          : tech.toLowerCase() === "html"
                          ? "bg-orange-500 text-white"
                          : tech.toLowerCase() === "css"
                          ? "bg-purple-600 text-white"
                          : tech.toLowerCase().includes("react")
                          ? "bg-blue-500 text-white"
                          : tech.toLowerCase().includes("typescript")
                          ? "bg-blue-400 text-white"
                          : tech.toLowerCase().includes("javascript")
                          ? "bg-yellow-400 text-black"
                          : tech.toLowerCase().includes("node")
                          ? "bg-green-500 text-white"
                          : tech.toLowerCase().includes("aws")
                          ? "bg-orange-400 text-white"
                          : tech.toLowerCase().includes("express")
                          ? "bg-gray-800 text-white"
                          : tech.toLowerCase().includes("supabase")
                          ? "bg-green-700 text-white"
                          : tech.toLowerCase().includes("discord")
                          ? "bg-indigo-500 text-white"
                          : tech.toLowerCase().includes("stripe")
                          ? "bg-purple-500 text-white"
                          : tech.toLowerCase().includes("api")
                          ? "bg-green-400 text-white"
                          : tech.toLowerCase().includes("nox")
                          ? "bg-gray-500 text-white"
                          : "bg-slate-600 text-white"
                      }`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 1.9 + index * 0.1 + i * 0.05,
                        ease: [0.4, 0, 0.2, 1],
                        layout: { duration: 0.15, ease: "easeOut" },
                        default: { duration: 0.15, ease: "easeOut" },
                      }}
                      whileHover={{
                        scale: 1.08,
                        y: -4,
                        transition: {
                          duration: 0.15,
                          ease: "easeOut",
                        },
                      }}
                      whileTap={{
                        scale: 0.95,
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop with blur */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative bg-slate-900 border border-blue-900 rounded-lg p-6 shadow-2xl text-white font-mono text-sm max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {projects[selectedProject].title}
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-slate-400 hover:text-white text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-slate-300 leading-relaxed">
                  {projects[selectedProject].detailedDescription}
                </p>
              </div>

              <div className="mb-6">
                <h4 className="text-blue-400 font-semibold mb-3">tech stack</h4>
                <div className="space-y-2">
                  {Object.entries(projects[selectedProject].techStack).map(
                    ([tech, description]) => (
                      <div key={tech} className="flex">
                        <span className="text-blue-300 min-w-[140px]">
                          {tech}
                        </span>
                        <span className="text-slate-400">/ {description}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-blue-400 font-semibold mb-3">features</h4>
                <ul className="space-y-2">
                  {projects[selectedProject].features.map((feature, i) => (
                    <li key={i} className="text-slate-300">
                      • {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-6 text-sm">
                <a
                  href={projects[selectedProject].github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <Github className="w-4 h-4 mr-2" />
                  src / github
                </a>
                <a
                  href={projects[selectedProject].demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  visit / demo
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                      alanwtom@outlook.com
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
                              await navigator.clipboard.writeText(
                                "alanwtom@outlook.com"
                              );
                              setFooterCopied(true);
                              setTimeout(() => {
                                setFooterShowCopy(false);
                                setFooterEmailRevealed(false);
                                setFooterCopied(false);
                              }, 1200);
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                await navigator.clipboard.writeText(
                                  "alanwtom@outlook.com"
                                );
                                setFooterCopied(true);
                                setTimeout(() => {
                                  setFooterShowCopy(false);
                                  setFooterEmailRevealed(false);
                                  setFooterCopied(false);
                                }, 1200);
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
              <Link href="https://github.com/alantomw" target="_blank">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Link>
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
              <Link
                href="https://www.linkedin.com/in/alan-tom/"
                target="_blank"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Link>
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
