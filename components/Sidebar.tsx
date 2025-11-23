"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { useTheme } from "./theme-provider";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants";

interface SidebarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { id: "main-content", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
  ];

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen w-64 bg-background/95 backdrop-blur-sm border-r border-border hidden md:flex flex-col justify-between p-8 z-50"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top Section: Profile */}
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src="/images/buttercup.jpg"
              alt="Alan Tom"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Alan Tom</h1>
            <p className="text-sm text-muted-foreground">CS Lead @ Syracuse</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Section: Socials & Theme */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            asChild
          >
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              <Linkedin className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => window.location.href = `mailto:${EMAIL}`}
          >
            <Mail className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Theme</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
