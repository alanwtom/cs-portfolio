"use client";

import {
  motion,
  PanInfo,
  useMotionValue,
  useTransform,
  useVelocity,
  useSpring,
} from "framer-motion";
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

export function Navbar({
  activeSection,
  setActiveSection,
  theme,
}: NavbarProps) {
  const [pillStyle, setPillStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [isDragging, setIsDragging] = useState(false);

  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const itemRectsRef = useRef<(DOMRect | null)[]>([]);

  // --- PHYSICS ENGINE FOR LIQUID FEEL ---
  const x = useMotionValue(0);
  // Track how fast we are dragging
  const xVelocity = useVelocity(x);
  // Transform velocity into a skew (distortion) value
  // The faster you drag, the more it warps (max 25 degrees)
  const skewXRaw = useTransform(xVelocity, [-1000, 1000], [25, -25]);
  // Smooth out the skew so it doesn't jitter
  const skewX = useSpring(skewXRaw, { mass: 0.1, stiffness: 200, damping: 20 });

  // Calculate width distortion based on velocity (stretch when fast)
  const widthScaleRaw = useTransform(
    xVelocity,
    [-1000, 0, 1000],
    [1.1, 1, 1.1]
  );
  const widthScale = useSpring(widthScaleRaw, {
    mass: 0.1,
    stiffness: 200,
    damping: 20,
  });

  // Update pill position when activeSection changes (if not dragging)
  useEffect(() => {
    if (isDragging) return;

    const activeIndex = NAV_ITEMS.findIndex(
      (item) => item.id === activeSection
    );
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

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    const dropPointX = info.point.x;
    let closestIndex = -1;
    let minDistance = Infinity;

    itemRectsRef.current.forEach((rect, index) => {
      if (rect) {
        const itemCenter = rect.left + rect.width / 2;
        const distance = Math.abs(dropPointX - itemCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    if (closestIndex !== -1) {
      setActiveSection(NAV_ITEMS[closestIndex].id);
    }
  };

  return (
    <nav className="flex items-center justify-center w-full overflow-x-auto no-scrollbar px-4 py-8 perspective-[1000px]">
      <div
        ref={navRef}
        className={cn(
          "relative flex items-center p-1.5 rounded-full flex-shrink-0 transition-all duration-500",
          "border backdrop-blur-[40px]", // Increased blur for deeper glass look
          theme === "dark"
            ? "bg-black/40 border-white/5 shadow-[0_0_0_1px_rgba(0,0,0,1),inset_0_0_30px_rgba(0,0,0,0.8)]"
            : "bg-white/60 border-white/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)]"
        )}
      >
        {/* The Liquid Pill */}
        <motion.div
          className={cn(
            "absolute top-1.5 bottom-1.5 rounded-full z-0 cursor-grab active:cursor-grabbing overflow-hidden group",
            theme === "dark"
              ? "bg-gradient-to-b from-zinc-700/60 to-zinc-900/60 border border-white/10"
              : "bg-gradient-to-b from-white to-zinc-100 shadow-sm"
          )}
          style={{
            left: pillStyle.left,
            width: pillStyle.width,
            x, // Bind motion value
            skewX, // Bind physics skew
            scaleX: widthScale, // Bind physics stretch
          }}
          animate={
            !isDragging
              ? {
                  left: pillStyle.left,
                  width: pillStyle.width,
                  opacity: pillStyle.opacity,
                  x: 0,
                  skewX: 0, // Reset skew when stopped
                  scaleX: 1,
                }
              : undefined
          }
          drag="x"
          dragConstraints={navRef}
          dragElastic={0.05} // Slight elasticity for "surface tension" feel
          dragMomentum={false}
          onDragStart={() => {
            setIsDragging(true);
            itemRectsRef.current = itemsRef.current.map(
              (el) => el?.getBoundingClientRect() || null
            );
          }}
          onDragEnd={handleDragEnd}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 25,
            mass: 0.8,
          }}
        >
          {/* Dynamic "Caustic" Shine - Moves opposite to drag direction for parallax */}
          <motion.div
            className="absolute -top-1/2 left-0 right-0 h-[200%] w-full bg-gradient-to-b from-white/30 via-transparent to-transparent blur-md"
            style={{ x: useTransform(x, (val) => val * -0.5) }} // Parallax effect
          />

          {/* Bottom Rim Light (Glass thickness) */}
          <div className="absolute bottom-0 left-2 right-2 h-[1px] bg-white/40 blur-[1px]" />
        </motion.div>

        {NAV_ITEMS.map((item, index) => {
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "relative px-6 py-2 text-sm rounded-full transition-all duration-300 z-10",
                "select-none cursor-pointer group",
                // Pointer events only blocked on active to allow drag
                isActive ? "pointer-events-none" : ""
              )}
              style={{ WebkitTapHighlightColor: "transparent" }}
            >
              {/* Morphing Text Animation:
                 We use a span to handle the scale/blur transition separately from the button layout
               */}
              <motion.span
                className={cn(
                  "block relative z-20",
                  isActive
                    ? theme === "dark"
                      ? "text-white font-bold drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                      : "text-black font-bold"
                    : theme === "dark"
                    ? "text-zinc-500 font-medium"
                    : "text-zinc-500 font-medium"
                )}
                animate={{
                  // "Warp" effect: Active text is sharp and slightly larger.
                  // Inactive text is slightly blurred and smaller.
                  scale: isActive ? 1.05 : 1,
                  filter: isActive ? "blur(0px)" : "blur(0.5px)",
                  opacity: isActive ? 1 : 0.7,
                }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                }}
              >
                {item.label}
              </motion.span>

              {/* Hover "Ghost" effect for inactive items */}
              {!isActive && (
                <span className="absolute inset-0 rounded-full bg-white/5 opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
