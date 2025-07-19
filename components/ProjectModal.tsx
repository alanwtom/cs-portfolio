"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, ArrowRight } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { Project } from "@/lib/constants";
import { useEffect } from "react";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { theme } = useTheme();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            onClick={onClose}
          >
            <motion.div
              className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-2xl ${
                theme === "dark"
                  ? "bg-[#0a1628] border border-[#1e293b]"
                  : "bg-white border border-[#e2e8f0]"
              }`}
              initial={{
                scale: 0.85,
                opacity: 0,
                y: 20,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                y: 0,
              }}
              exit={{
                scale: 0.85,
                opacity: 0,
                y: 20,
              }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 400,
                duration: 0.4,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <motion.h2
                    className="text-2xl font-semibold"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {project.title}
                  </motion.h2>
                  <motion.button
                    onClick={onClose}
                    className={`text-2xl hover:opacity-70 transition-all duration-200 hover:scale-110 ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}
                    aria-label="Close modal"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                {/* Description */}
                <motion.p
                  className={`text-base leading-relaxed ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {project.detailedDescription}
                </motion.p>

                {/* Tech Stack */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium">Tech Stack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(project.techStack).map(
                      ([tech, description], index) => (
                        <motion.div
                          key={tech}
                          className={`p-3 rounded-md ${
                            theme === "dark"
                              ? "bg-slate-800/50 border border-slate-700"
                              : "bg-slate-50 border border-slate-200"
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 0.3 + index * 0.05,
                            duration: 0.3,
                          }}
                        >
                          <div className="font-mono text-sm font-medium">
                            {tech}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              theme === "dark"
                                ? "text-slate-400"
                                : "text-slate-600"
                            }`}
                          >
                            {description}
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <h3 className="text-lg font-medium">Key Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <motion.li
                        key={index}
                        className={`flex items-start gap-2 ${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <span className="text-blue-500 mt-1">•</span>
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  <Button
                    asChild
                    className="flex-1"
                    variant={theme === "dark" ? "default" : "default"}
                  >
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ArrowRight className="w-4 h-4" />
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
