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
import { motion, useAnimation } from "framer-motion";

export default function Portfolio() {
  const { theme } = useTheme();
  const [emailRevealed, setEmailRevealed] = useState(false);
  const emailHoldTimeout = useRef<NodeJS.Timeout | null>(null);
  const [showCopyBubble, setShowCopyBubble] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyBubbleRef = useRef<HTMLDivElement | null>(null);

  const skills = [
    "Python",
    "TypeScript",
    "JavaScript",
    "Java",
    "React",
    "Next.js",
    "Vercel",
    "Git",
    "Linux",
  ];

  const projects = [
    {
      title: "Discord Bot",
      description:
        "Discord bot for career development with resume resources, real time job and event tracking, and learning material recommendations.",
      tech: ["Python", "Discord.py", "GCP", "Nox"],
      github: "https://github.com/innovateorange/DiscordBot/issues",
      demo: "https://discord.gg/cvqbKxPtHE",
    },
    {
      title: "Flow",
      description:
        "Sleek browser extension that helps users maintain focus by blocking distracting elements while browsing.",
      tech: ["Next.js", "TypeScript", "Chart.js", "Weather API"],
      github: "https://github.com/alantomw/Flow",
      demo: "https://chromewebstore.google.com/detail/flow/odenofhkafaeedoohodgdndpeeadpndg",
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

  return (
    <div
      className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* Navigation */}
      <nav
        className={`backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-black/80 border-b border-slate-800/50"
            : "bg-white/80 border-b border-slate-200/50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-8 py-6 flex items-center justify-between">
          {/* Logo on the left */}
          <div className="flex items-center">
            <span
              className="text-2xl align-middle hover:scale-110 transition-transform duration-300"
              role="img"
              aria-label="Map of Japan"
            >
              🗾
            </span>
          </div>

          {/* Navigation links in center */}
          <div className="hidden md:flex space-x-6">
            {["Home", "About", "Projects", "Contact"].map((item, index) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`transition-all duration-300 hover:scale-105 relative group ${
                  theme === "dark"
                    ? "text-slate-300 hover:text-white"
                    : "text-slate-600 hover:text-black"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    theme === "dark" ? "bg-white" : "bg-black"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* Theme toggle on the right */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Profile Section (Avatar + Name + About Me) */}
      <section id="about" className="max-w-4xl mx-auto px-8 py-12">
        <Card
          className={`p-8 transition-all duration-500 backdrop-blur-sm ${
            theme === "dark"
              ? "bg-[#0a1628]/90 border-[#1e293b]/60"
              : "bg-[#eaf1fb]/80 border-[#b6d0ee]/60"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Avatar */}
            <img
              src="/images/buttercup.jpg"
              alt="Profile avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 dark:border-slate-800 shadow-md"
            />
            <div className="flex-1 space-y-4">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight cursor-default">
                Alan Tom
              </h1>
              <div
                className={`space-y-4 leading-relaxed ${
                  theme === "dark" ? "text-slate-300" : "text-slate-600"
                }`}
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
                <p
                  className={`transition-colors duration-300 ${
                    theme === "dark"
                      ? "hover:text-slate-200"
                      : "hover:text-slate-800"
                  }`}
                >
                  Currently learning full-stack development and always looking
                  for opportunities to collaborate on interesting projects.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Experience Timeline Section */}
      <section id="experience" className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-light mb-10 cursor-default">Timeline</h2>
        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-3 top-0 h-full w-0.5 bg-slate-300 dark:bg-slate-700"
            style={{ zIndex: 0 }}
          />
          {/* Timeline items */}
          {[
            {
              color: "bg-blue-600",
              company: "iSchool at Syracuse University",
              title: "NSF REU Reseacher",
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
            <div
              key={item.company + item.title}
              className="flex items-start mb-12 last:mb-0 relative group cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.025] hover:shadow-2xl focus-within:scale-[1.025] focus-within:shadow-2xl"
              style={{ zIndex: 1 }}
              tabIndex={0}
            >
              {/* Dot with glow on hover */}
              <span
                className={`absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${item.color} transition-all duration-300 group-hover:shadow-[0_0_0_6px_rgba(59,130,246,0.15)] group-hover:brightness-125 group-focus:shadow-[0_0_0_6px_rgba(59,130,246,0.18)]`}
                style={{ zIndex: 2 }}
              />
              <div className="ml-8 flex-1 flex flex-row justify-between items-start">
                <div>
                  <span className="font-bold text-base md:text-lg group-hover:text-white group-focus:text-white transition-colors duration-300">
                    {item.company}
                  </span>
                  <div className="italic text-slate-500 dark:text-slate-300 text-base mb-1 group-hover:text-slate-200 transition-colors duration-300">
                    {item.title}
                  </div>
                  <ul className="list-disc ml-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                    <li>{item.desc}</li>
                  </ul>
                </div>
                <span className="text-md text-slate-400 dark:text-slate-400 ml-4 whitespace-nowrap min-w-[90px] text-right pt-1 group-hover:text-white transition-colors duration-300">
                  {item.years}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="max-w-4xl mx-auto px-8 py-12">
        <div className="space-y-6">
          <h2 className="text-3xl font-light cursor-default">Projects</h2>
          <div className="flex flex-col gap-6">
            {projects.map((project, index) => (
              <div
                key={project.title}
                className="flex flex-row justify-between items-start w-full group cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[1.025] hover:shadow-2xl focus-within:scale-[1.025] focus-within:shadow-2xl"
                tabIndex={0}
              >
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-base md:text-lg group-hover:text-white group-focus:text-white transition-colors duration-300">
                    {project.title}
                  </span>
                  <div
                    className={`mt-1 text-slate-500 dark:text-slate-400 text-sm md:text-base max-w-2xl group-hover:text-slate-200 transition-colors duration-300`}
                  >
                    {project.description}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 ml-6 mt-1 justify-end min-w-[120px]">
                  {project.tech.map((tech, i) => (
                    <span
                      key={tech}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap shadow transition-all duration-300 group-hover:scale-105 group-hover:brightness-110 group-focus:scale-105 group-focus:brightness-110 ${
                        tech.toLowerCase().includes("react")
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
                          : tech.toLowerCase().includes("gcp")
                          ? "bg-yellow-600 text-white"
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
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-4xl mx-auto px-8 py-12">
        <Card
          className={`p-8 transition-all duration-500 backdrop-blur-sm ${
            theme === "dark"
              ? "bg-[#0a1628]/90 border-[#1e293b]/60"
              : "bg-[#eaf1fb]/80 border-[#b6d0ee]/60"
          }`}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-light cursor-default">
              Let's Connect
            </h2>
            <p
              className={`text-lg max-w-md mx-auto ${
                theme === "dark" ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Always interested in new opportunities and collaborations. Let's
              build something amazing together.
            </p>
            <div className="flex justify-center space-x-4 pt-4">
              {/* Email Button: Press and Hold to Reveal */}
              <Button
                variant="ghost"
                size="sm"
                asChild={false}
                className={`transition-all duration-300 hover:scale-110 ${
                  theme === "dark"
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 hover:text-black"
                }`}
                onMouseDown={() => {
                  if (!emailRevealed) {
                    emailHoldTimeout.current = setTimeout(() => {
                      setEmailRevealed(true);
                    }, 700);
                  }
                }}
                onMouseUp={() => {
                  if (emailHoldTimeout.current) {
                    clearTimeout(emailHoldTimeout.current);
                  }
                }}
                onMouseLeave={() => {
                  if (emailHoldTimeout.current) {
                    clearTimeout(emailHoldTimeout.current);
                  }
                }}
                onTouchStart={() => {
                  if (!emailRevealed) {
                    emailHoldTimeout.current = setTimeout(() => {
                      setEmailRevealed(true);
                    }, 700);
                  }
                }}
                onTouchEnd={() => {
                  if (emailHoldTimeout.current) {
                    clearTimeout(emailHoldTimeout.current);
                  }
                }}
              >
                {emailRevealed ? (
                  <span className="flex items-center relative">
                    <Mail className="w-4 h-4 mr-2" />
                    <span
                      className="cursor-pointer underline decoration-dotted decoration-2 underline-offset-4"
                      onClick={() => {
                        setShowCopyBubble((prev) => !prev);
                        setCopied(false);
                      }}
                    >
                      alanwtom@outlook.com
                    </span>
                    {/* Copy Bubble */}
                    {showCopyBubble && (
                      <div
                        ref={copyBubbleRef}
                        className={`inline-block absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 rounded-xl shadow-lg px-1 py-1 text-sm font-medium transition-all duration-200 ${
                          theme === "dark"
                            ? "bg-slate-800 text-white border border-slate-700"
                            : "bg-white text-black border border-slate-200"
                        }`}
                        style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.18)" }}
                      >
                        {copied ? (
                          <span className="text-green-500 text-[10px]">
                            Copied!
                          </span>
                        ) : (
                          <div
                            role="button"
                            tabIndex={0}
                            className={`inline-block text-[10px] text-left px-0.5 py-0 bg-transparent hover:underline focus:outline-none cursor-pointer select-none font-normal transition-colors duration-150 shadow-none border-none m-0 ${
                              theme === "dark"
                                ? "hover:text-green-400"
                                : "hover:text-green-600"
                            }`}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await navigator.clipboard.writeText(
                                "alanwtom@outlook.com"
                              );
                              setCopied(true);
                              setTimeout(() => {
                                setShowCopyBubble(false);
                              }, 1200);
                            }}
                            onKeyDown={async (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                await navigator.clipboard.writeText(
                                  "alanwtom@outlook.com"
                                );
                                setCopied(true);
                                setTimeout(() => {
                                  setShowCopyBubble(false);
                                }, 1200);
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
                  <span className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Press & Hold for Email
                  </span>
                )}
              </Button>
              {/* Other contact icons */}
              {[
                {
                  icon: Github,
                  href: "https://github.com/alantomw",
                  label: "GitHub",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/in/alan-tom/",
                  label: "LinkedIn",
                },
              ].map(({ icon: Icon, href, label }, index) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  asChild
                  className={`transition-all duration-300 hover:scale-110 ${
                    theme === "dark"
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-600 hover:text-black"
                  }`}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                  <Link href={href} target="_blank">
                    <Icon className="w-4 h-4 mr-2" />
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer
        className={`border-t mt-20 py-8 backdrop-blur-sm transition-colors duration-300 ${
          theme === "dark" ? "border-slate-800/50" : "border-slate-200/50"
        }`}
      >
        <div className="max-w-4xl mx-auto px-8 text-center">
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
      </footer>
    </div>
  );
}
