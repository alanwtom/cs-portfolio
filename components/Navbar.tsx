"use client";

import { motion, PanInfo } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, useState, useEffect } from "react";

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  theme: string;
}

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "university", label: "University" },
];

export function Navbar({ activeSection, setActiveSection, theme }: NavbarProps) {
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  // Refs for button elements
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRectsRef = useRef<(DOMRect | null)[]>([]);

  // Update pill position when activeSection changes (and not dragging)
  useEffect(() => {
    if (isDragging) return;

    const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);
    const currentItem = itemsRef.current[activeIndex];
    const navContainer = navRef.current;

    if (currentItem && navContainer) {
      const navRect = navContainer.getBoundingClientRect();
      const itemRect = currentItem.getBoundingClientRect();

      setPillStyle({
        left: itemRect.left - navRect.left,
        width: itemRect.width,
        opacity: 1,
      });
    }
  }, [activeSection, isDragging]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const activeIndex = NAV_ITEMS.findIndex((item) => item.id === activeSection);
      const currentItem = itemsRef.current[activeIndex];
      const navContainer = navRef.current;

      if (currentItem && navContainer) {
        const navRect = navContainer.getBoundingClientRect();
        const itemRect = currentItem.getBoundingClientRect();
        setPillStyle({
          left: itemRect.left - navRect.left,
          width: itemRect.width,
          opacity: 1,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeSection]);

  // Determine active section during drag
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Use cached rects for better performance during drag
    const dragX = info.point.x;

    let closestIndex = -1;
    let minDistance = Infinity;

    itemRectsRef.current.forEach((rect, index) => {
      if (rect) {
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(dragX - center);

        if (dragX >= rect.left && dragX <= rect.right) {
          closestIndex = index;
          minDistance = 0;
        } else if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== -1 && NAV_ITEMS[closestIndex].id !== activeSection) {
      setActiveSection(NAV_ITEMS[closestIndex].id);
    }
  };

  return (
    <nav className="flex items-center justify-center w-full overflow-x-auto no-scrollbar px-4 py-2">
      <div
        ref={navRef}
        className={cn(
          "relative flex space-x-1 rounded-full p-1.5 transition-all duration-300 flex-shrink-0",
          "backdrop-blur-2xl shadow-lg ring-1 ring-white/10",
          theme === "dark"
            ? "bg-white/10 shadow-[0_0_20px_-5px_rgba(255,255,255,0.15)]"
            : "bg-black/5 shadow-[0_0_20px_-5px_rgba(0,0,0,0.1)]"
        )}
        style={{
          background: theme === "dark"
            ? "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
            : "linear-gradient(145deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.01) 100%)",
        }}
      >
        {/* Persistent Pill */}
        <motion.div
          className={cn(
            "absolute top-1.5 bottom-1.5 rounded-full shadow-sm cursor-grab active:cursor-grabbing z-0",
            theme === "dark" ? "bg-white" : "bg-black"
          )}
          animate={!isDragging ? {
            left: pillStyle.left,
            width: pillStyle.width,
            opacity: pillStyle.opacity,
            x: 0 // Reset x transform when dragging ends
          } : undefined}
          drag="x"
          dragConstraints={navRef}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => {
            setIsDragging(true);
            // Cache item rects to avoid layout thrashing during drag
            itemRectsRef.current = itemsRef.current.map(el => el?.getBoundingClientRect() || null);
          }}
          onDrag={handleDrag}
          onDragEnd={() => setIsDragging(false)}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 1,
          }}
          style={{
            boxShadow: theme === "dark"
              ? "0 0 15px 2px rgba(255, 255, 255, 0.3)"
              : "0 0 15px 2px rgba(0, 0, 0, 0.2)",
            left: pillStyle.left,
            width: pillStyle.width,
          }}
        />

        {NAV_ITEMS.map((item, index) => (
          <button
            key={item.id}
            ref={(el) => { itemsRef.current[index] = el; }}
            onClick={() => setActiveSection(item.id)}
            className={cn(
              "relative px-5 py-2 text-sm rounded-full transition-colors duration-300 z-10",
              "hover:text-opacity-80 select-none cursor-pointer",
              activeSection === item.id
                ? theme === "dark"
                  ? "text-black pointer-events-none"
                  : "text-white pointer-events-none"
                : theme === "dark"
                ? "text-slate-200 font-medium"
                : "text-slate-600 font-medium"
            )}
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* Invisible bold text to reserve space and prevent layout shift */}
            <span className="invisible font-bold">{item.label}</span>
            {/* Visible text centered absolutely */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                activeSection === item.id ? "font-bold" : "font-medium"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
