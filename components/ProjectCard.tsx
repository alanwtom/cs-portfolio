"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { Project } from "@/lib/constants";

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

export function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const { theme } = useTheme();

  return (
    <motion.div
      className="flex flex-row justify-between items-start w-full group cursor-pointer relative"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
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
      <div className="flex-1 space-y-2 p-4">
        <div className="flex items-center gap-2">
          <h3
            className={`text-lg font-medium transition-colors duration-200 ${
              theme === "dark"
                ? "text-white group-hover:text-blue-300"
                : "text-black group-hover:text-blue-600"
            }`}
          >
            {project.title}
          </h3>
          <ArrowRight
            className={`w-4 h-4 transition-all duration-200 ${
              theme === "dark"
                ? "text-slate-400 group-hover:text-blue-300"
                : "text-slate-600 group-hover:text-blue-600"
            } group-hover:translate-x-1`}
          />
        </div>
        <p
          className={`text-base leading-relaxed transition-colors duration-200 ${
            theme === "dark"
              ? "text-slate-400 group-hover:text-slate-300"
              : "text-slate-600 group-hover:text-slate-700"
          }`}
        >
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className={`px-2 py-1 text-xs rounded-md font-mono transition-colors duration-200 ${
                theme === "dark"
                  ? "bg-slate-800 text-slate-300 group-hover:bg-slate-700"
                  : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
              }`}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
