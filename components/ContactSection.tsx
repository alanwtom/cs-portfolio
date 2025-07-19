"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Github, Linkedin } from "lucide-react"
import { useTheme } from "./theme-provider"
import { useEmailReveal } from "@/hooks/use-email-reveal"
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/lib/constants"

export function ContactSection() {
  const { theme } = useTheme()
  const {
    isRevealed,
    showCopyBubble,
    copied,
    copyBubbleRef,
    handleMouseDown,
    handleMouseUp,
    handleMouseLeave,
    copyToClipboard,
  } = useEmailReveal()

  return (
    <motion.section
      id="contact"
      className="max-w-3xl mx-auto px-6 py-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.0 }}
    >
      <Card
        className={`p-6 transition-all duration-500 backdrop-blur-sm ${
          theme === "dark"
            ? "bg-[#0a1628]/90 border-[#1e293b]/60"
            : "bg-[#eaf1fb]/80 border-[#b6d0ee]/60"
        }`}
      >
        <div className="space-y-6">
          <motion.h2
            className="text-3xl font-light cursor-default"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            Get in Touch
          </motion.h2>

          <motion.p
            className={`leading-relaxed ${
              theme === "dark" ? "text-slate-300" : "text-slate-600"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            I'm always open to discussing new opportunities, interesting projects, or just having a chat about technology and innovation.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
          >
            {/* Email Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className={`transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                  theme === "dark"
                    ? "border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white"
                    : "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-black"
                }`}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                <Mail className="w-4 h-4 mr-2" />
                {isRevealed ? EMAIL : "Email"}
              </Button>

              {/* Copy Bubble */}
              <AnimatePresence>
                {showCopyBubble && (
                  <motion.div
                    ref={copyBubbleRef}
                    className={`absolute top-full left-0 mt-2 p-2 rounded-md shadow-lg z-10 ${
                      theme === "dark"
                        ? "bg-slate-800 border border-slate-700"
                        : "bg-white border border-slate-200"
                    }`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <button
                      onClick={copyToClipboard}
                      className={`text-sm px-2 py-1 rounded transition-colors ${
                        copied
                          ? theme === "dark"
                            ? "text-green-400"
                            : "text-green-600"
                          : theme === "dark"
                          ? "text-slate-300 hover:text-white"
                          : "text-slate-700 hover:text-black"
                      }`}
                    >
                      {copied ? "Copied!" : "Copy email"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* GitHub Button */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white"
                  : "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-black"
              }`}
            >
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>

            {/* LinkedIn Button */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className={`transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 ${
                theme === "dark"
                  ? "border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white"
                  : "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-black"
              }`}
            >
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.section>
  )
}
