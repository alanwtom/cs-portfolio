"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, Copy, ExternalLink, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";

interface LinkEmbedProps {
  className?: string;
}

interface EmbedData {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName: string;
  favicon?: string;
}

export function LinkEmbed({ className }: LinkEmbedProps) {
  const { theme } = useTheme();
  const [link, setLink] = useState("");
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedData, setEmbedData] = useState<EmbedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const detectLinkType = (
    url: string
  ): "linkedin" | "discord" | "other" | null => {
    if (!url) return null;

    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes("linkedin.com")) return "linkedin";
    if (lowerUrl.includes("discord.com") || lowerUrl.includes("discord.gg"))
      return "discord";
    return "other";
  };

  const generateEmbedData = (
    url: string,
    type: "linkedin" | "discord" | "other"
  ): EmbedData => {
    const urlObj = new URL(url);

    switch (type) {
      case "linkedin":
        return {
          title: "Alan Tom",
          description:
            "Computer Science junior at Syracuse University, leading CuseHacks hackathon and building innovative web applications and Discord bots.",
          url: url,
          siteName: "LinkedIn",
          favicon:
            "https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg",
        };
      case "discord":
        return {
          title: "Alan Tom's Discord",
          description:
            "Connect with me on Discord for collaboration, project discussions, and tech conversations.",
          url: url,
          siteName: "Discord",
          favicon:
            "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png",
        };
      default:
        return {
          title: "External Link",
          description: "Click to visit this external resource.",
          url: url,
          siteName: urlObj.hostname,
          favicon: `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`,
        };
    }
  };

  const handleLinkPaste = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pastedText = e.target.value;
    setLink(pastedText);

    // Check if the pasted text looks like a URL
    if (
      pastedText &&
      (pastedText.startsWith("http://") ||
        pastedText.startsWith("https://") ||
        pastedText.includes("."))
    ) {
      const linkType = detectLinkType(pastedText);
      if (linkType) {
        setIsLoading(true);
        const embed = generateEmbedData(pastedText, linkType);
        setEmbedData(embed);
        setShowEmbed(true);
        setIsLoading(false);
      }
    } else {
      setShowEmbed(false);
      setEmbedData(null);
    }
  };

  const handleClear = () => {
    setLink("");
    setShowEmbed(false);
    setEmbedData(null);
  };

  const handleCopyLink = async () => {
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        // You could add a toast notification here
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const handleVisitLink = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className={`max-w-md mx-auto space-y-4 ${className}`}>
      <Card
        className={`p-6 transition-all duration-500 backdrop-blur-sm ${
          theme === "dark"
            ? "bg-[#0a1628]/90 border-[#1e293b]/60"
            : "bg-[#eaf1fb]/80 border-[#b6d0ee]/60"
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Link Embed</h3>
          </div>

          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste a LinkedIn or Discord link here..."
              value={link}
              onChange={handleLinkPaste}
              className="w-full"
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={!link}
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
              {link && (
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {showEmbed && embedData && (
              <motion.div
                className={`mt-4 p-4 rounded-lg border transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-slate-800/50 border-slate-700"
                    : "bg-slate-50 border-slate-200"
                }`}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-start gap-3">
                  {embedData.favicon && (
                    <img
                      src={embedData.favicon}
                      alt={`${embedData.siteName} icon`}
                      className="w-6 h-6 rounded-sm flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {embedData.siteName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new URL(embedData.url).hostname}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base mb-1 line-clamp-1">
                      {embedData.title}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {embedData.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={handleVisitLink}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Link
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              className="mt-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Loading embed...
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
}
