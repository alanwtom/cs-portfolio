import React, { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";

interface TypeWriterProps {
  texts: string[];
  speed?: number;
  pauseDuration?: number;
  className?: string;
}

export const TypeWriter: React.FC<TypeWriterProps> = ({
  texts,
  speed = 50,
  pauseDuration = 1000,
  className = "",
}) => {
  const { theme } = useTheme();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedTexts, setDisplayedTexts] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isActivelyTyping, setIsActivelyTyping] = useState(true);

  useEffect(() => {
    if (currentTextIndex >= texts.length) {
      setIsCompleted(true);
      setIsActivelyTyping(false);
      return;
    }

    const currentText = texts[currentTextIndex];

    if (currentCharIndex < currentText.length) {
      setIsActivelyTyping(true);
      const currentChar = currentText[currentCharIndex];
      const isComma = currentChar === ",";
      const delay = isComma ? speed + 300 : speed; // Add 300ms pause on commas

      const timer = setTimeout(() => {
        setDisplayedTexts((prev) => {
          const newTexts = [...prev];
          if (newTexts[currentTextIndex]) {
            newTexts[currentTextIndex] = currentText.slice(
              0,
              currentCharIndex + 1
            );
          } else {
            newTexts[currentTextIndex] = currentText.slice(
              0,
              currentCharIndex + 1
            );
          }
          return newTexts;
        });
        setCurrentCharIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      // Current text is complete, pause then move to next
      setIsActivelyTyping(false);
      const pauseTimer = setTimeout(() => {
        setCurrentTextIndex((prev) => prev + 1);
        setCurrentCharIndex(0);
      }, pauseDuration);

      return () => clearTimeout(pauseTimer);
    }
  }, [currentTextIndex, currentCharIndex, texts, speed, pauseDuration]);

  // Cursor blinking effect - only when not actively typing
  useEffect(() => {
    if (isActivelyTyping) {
      setShowCursor(true); // Keep cursor solid while typing
      return;
    }

    // Hide cursor completely when not typing and completed
    if (isCompleted) {
      setShowCursor(false);
      return;
    }

    const cursorTimer = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 1200);

    return () => clearInterval(cursorTimer);
  }, [isActivelyTyping, isCompleted]);

  return (
    <div className={className}>
      {displayedTexts.map((text, index) => (
        <p
          key={index}
          className={`transition-colors duration-300 ${
            theme === "dark" ? "hover:text-slate-200" : "hover:text-slate-800"
          } ${index > 0 ? "mt-4" : ""}`}
        >
          {text}
          {(index === currentTextIndex && !isCompleted) && (
            <span
              className={`inline-block w-0.5 ml-1 ${
                theme === "dark" ? "bg-white" : "bg-black"
              } ${
                showCursor ? "opacity-100" : "opacity-0"
              } transition-opacity duration-500 ease-in-out`}
              style={{
                height: "1.2em",
                verticalAlign: "text-bottom",
              }}
            />
          )}
        </p>
      ))}
    </div>
  );
};
