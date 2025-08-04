"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Copy } from "lucide-react";

export function LinkEmbed() {
  const [link, setLink] = useState("");
  const [showEmbed, setShowEmbed] = useState(false);

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
      setShowEmbed(true);
    } else {
      setShowEmbed(false);
    }
  };

  const handleClear = () => {
    setLink("");
    setShowEmbed(false);
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

  return (
    <div className="max-w-md mx-auto space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Link Embed</h3>
          </div>

          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste a link here..."
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

          {showEmbed && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  wowzers
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Link embedded successfully!
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
