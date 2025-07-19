"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Github, ArrowRight } from "lucide-react"
import { useTheme } from "./theme-provider"
import type { Project } from "@/lib/constants"

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const { theme } = useTheme()

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg p-6 shadow-2xl ${
                theme === "dark"
                  ? "bg-[#0a1628] border border-[#1e293b]"
                  : "bg-white border border-[#e2e8f0]"
              }`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold">{project.title}</h2>
                  <button
                    onClick={onClose}
                    className={`text-2xl hover:opacity-70 transition-opacity ${
                      theme === "dark" ? "text-slate-400" : "text-slate-600"
                    }`}
                    aria-label="Close modal"
                  >
                    ×
                  </button>
                </div>

                {/* Description */}
                <p
                  className={`text-lg leading-relaxed ${
                    theme === "dark" ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {project.detailedDescription}
                </p>

                {/* Tech Stack */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Tech Stack</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(project.techStack).map(([tech, description]) => (
                      <div
                        key={tech}
                        className={`p-3 rounded-md ${
                          theme === "dark"
                            ? "bg-slate-800/50 border border-slate-700"
                            : "bg-slate-50 border border-slate-200"
                        }`}
                      >
                        <div className="font-mono text-sm font-medium">{tech}</div>
                        <div
                          className={`text-xs mt-1 ${
                            theme === "dark" ? "text-slate-400" : "text-slate-600"
                          }`}
                        >
                          {description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Key Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li
                        key={index}
                        className={`flex items-start gap-2 ${
                          theme === "dark" ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        <span className="text-blue-500 mt-1">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
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
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1"
                  >
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
