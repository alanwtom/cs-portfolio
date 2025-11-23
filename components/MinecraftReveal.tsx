import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SGA_MAPPING: Record<string, string> = {
  a: "ᔑ", b: "ʖ", c: "ᓵ", d: "↸", e: "ᒷ", f: "⎓", g: "⊣", h: "⍑", i: "╎", j: "⋮", k: "ꖎ", l: "ꖃ", m: "ᒲ",
  n: "リ", o: "𝙹", p: "!¡", q: "ᑑ", r: "∷", s: "ᓭ", t: "ℸ ̣", u: "⚍", v: "⍊", w: "∴", x: "̇/", y: "||", z: "⨅",
  A: "ᔑ", B: "ʖ", C: "ᓵ", D: "↸", E: "ᒷ", F: "⎓", G: "⊣", H: "⍑", I: "╎", J: "⋮", K: "ꖎ", L: "ꖃ", M: "ᒲ",
  N: "リ", O: "𝙹", P: "!¡", Q: "ᑑ", R: "∷", S: "ᓭ", T: "ℸ ̣", U: "⚍", V: "⍊", W: "∴", X: "̇/", Y: "||", Z: "⨅",
};

interface MinecraftRevealProps {
  text: string;
  className?: string;
  startDelayMs?: number;
  revealSpeed?: number;
}

export const MinecraftReveal: React.FC<MinecraftRevealProps> = ({
  text,
  className = "",
  startDelayMs = 1000,
  revealSpeed = 70,
}) => {
  // State to track how many characters have been revealed (converted to English)
  const [revealedIndex, setRevealedIndex] = useState(0);

  useEffect(() => {
    // Start revealing after a short initial delay
    const startDelay = setTimeout(() => {
      const interval = setInterval(() => {
        setRevealedIndex((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, revealSpeed); // Speed of reveal (ms per character)

      return () => clearInterval(interval);
    }, startDelayMs); // Hold the runes for 1 second

    return () => clearTimeout(startDelay);
  }, [text.length, startDelayMs, revealSpeed]);

  return (
    <span className={className} aria-label={text}>
      {text.split("").map((char, index) => {
        const isRevealed = index < revealedIndex;
        const displayChar = isRevealed ? char : (SGA_MAPPING[char] || char);

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`${index}-${isRevealed ? "en" : "sga"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {displayChar}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        );
      })}
    </span>
  );
};
