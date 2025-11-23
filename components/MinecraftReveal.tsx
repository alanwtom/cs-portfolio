import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// We'll use this mapping as a fallback or if we want to use system fonts for symbols
// But the user wants the ACTUAL Minecraft font symbols which are pixelated.
// So we will try to rely on the font-family 'SGA' if we can load it.
// If we can't load it, we fall back to these Unicode characters which look like SGA but are smooth.
const SGA_MAPPING: Record<string, string> = {
  a: "ᔑ",
  b: "ʖ",
  c: "ᓵ",
  d: "↸",
  e: "ᒷ",
  f: "⎓",
  g: "⊣",
  h: "⍑",
  i: "╎",
  j: "⋮",
  k: "ꖎ",
  l: "ꖃ",
  m: "ᒲ",
  n: "リ",
  o: "𝙹",
  p: "!¡",
  q: "ᑑ",
  r: "∷",
  s: "ᓭ",
  t: "ℸ ̣",
  u: "⚍",
  v: "⍊",
  w: "∴",
  x: "̇/",
  y: "||",
  z: "⨅",
  A: "ᔑ",
  B: "ʖ",
  C: "ᓵ",
  D: "↸",
  E: "ᒷ",
  F: "⎓",
  G: "⊣",
  H: "⍑",
  I: "╎",
  J: "⋮",
  K: "ꖎ",
  L: "ꖃ",
  M: "ᒲ",
  N: "リ",
  O: "𝙹",
  P: "!¡",
  Q: "ᑑ",
  R: "∷",
  S: "ᓭ",
  T: "ℸ ̣",
  U: "⚍",
  V: "⍊",
  W: "∴",
  X: "̇/",
  Y: "||",
  Z: "⨅",
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
        // Fallback: if we use mapping, we get smooth unicode symbols.
        // Ideally, we use the English char with a special font.
        const displayChar = isRevealed ? char : SGA_MAPPING[char] || char;

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            // If not revealed, we apply 'font-minecraft' which we hope has the SGA glyphs
            // OR we use the Unicode characters and try to make them pixelated.
            // The user says symbols are smooth. That means 'font-minecraft' (English pixel font)
            // does NOT have glyphs for 'ᔑ', so it falls back to system font.
            // To fix: We must NOT use Unicode mapping if we want true pixelated SGA.
            // We must use English characters 'a' and apply a font that turns 'a' into a pixelated rune.
            // Since I failed to download the font, I will stick to Unicode mapping but force 'font-minecraft'
            // on the *English* text only when revealed, and try to find a way to pixelate the Unicode.
            // WAIT! The user said "symbols are smooth... actual content is minecraft".
            // So 'font-minecraft' works for English.
            // The Unicode symbols are smooth because they are system fonts.
            // I need to apply a PIXELATED font that supports Canadian Aboriginal Syllabics if one exists,
            // OR I need to successfully download the SGA font.

            // Since I can't verify the font download, I will try to force pixelation on the Unicode symbols
            // using a CSS trick: text-shadow 0 0 0 might sometimes help, but really 'font-smooth: none' is the key.
            // If that failed, it's likely the system font itself is outlined.

            // Let's try this: Use the English font for revealed text.
            // For hidden text, use the UNICODE mapping but add a class that enforces pixelation more aggressively?
            // Or, I can use a web-hosted font URL in the CSS.
            className={!isRevealed ? "font-minecraft" : ""}
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
