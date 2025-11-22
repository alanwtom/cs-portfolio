"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  theme: string;
}

export function Navbar({ activeSection, setActiveSection, theme }: NavbarProps) {
  const navItems = [
    { id: "home", label: "Home" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "university", label: "University" },
  ];

  return (
    <nav className="flex items-center justify-center">
      <div
        className={cn(
          "flex space-x-1 rounded-full p-1.5 transition-all duration-300",
          "backdrop-blur-2xl shadow-lg ring-1 ring-white/10",
          theme === "dark"
            ? "bg-white/5 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]"
            : "bg-black/5 shadow-[0_0_20px_-5px_rgba(0,0,0,0.1)]"
        )}
        style={{
          // Neo-glass "liquid" feel specific styles
          background: theme === "dark" 
            ? "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)"
            : "linear-gradient(145deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.01) 100%)",
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300",
              "hover:text-opacity-80",
              activeSection === item.id
                ? theme === "dark"
                  ? "text-black font-bold"
                  : "text-white font-bold"
                : theme === "dark"
                ? "text-slate-300"
                : "text-slate-600"
            )}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {activeSection === item.id && (
              <motion.div
                layoutId="active-pill"
                className={cn(
                  "absolute inset-0 rounded-full mix-blend-normal shadow-sm",
                  theme === "dark" ? "bg-white" : "bg-black"
                )}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  mass: 1, // Heavier feel for "liquid"
                }}
                style={{
                  boxShadow: theme === "dark"
                    ? "0 0 15px 2px rgba(255, 255, 255, 0.3)"
                    : "0 0 15px 2px rgba(0, 0, 0, 0.2)",
                }}
              />
            )}
            <span className="relative z-10 mix-blend-normal">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

