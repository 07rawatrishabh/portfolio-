import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";

/**
 * A two-part magnetic cursor: an instant inner dot and a smoothed,
 * spring-following outer ring. The ring expands over interactive elements,
 * and morphs into a labelled pill when hovering anything with a
 * `data-cursor="…"` attribute (e.g. "Open", "Say hi").
 * Only activates on devices with a fine pointer.
 */
export default function CustomCursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  const lastTarget = useRef<EventTarget | null>(null);

  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (e.target !== lastTarget.current) {
        lastTarget.current = e.target;
        const el = e.target as HTMLElement;
        const labelled = el.closest<HTMLElement>("[data-cursor]");
        if (labelled) {
          setLabel(labelled.dataset.cursor || null);
          setHovering(true);
        } else {
          setLabel(null);
          setHovering(
            !!el.closest('a, button, [role="button"], input, textarea, select, .cursor-grow')
          );
        }
      }
    };
    const leave = () => setHidden(true);
    const enter = () => setHidden(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
      document.documentElement.classList.remove("custom-cursor-active");
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[120]">
      {/* Inner dot */}
      <motion.div
        className="fixed left-0 top-0 h-2 w-2 rounded-full bg-teal-300 mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: hidden ? 0 : 1, scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.18 }}
      />
      {/* Outer ring / label pill */}
      <motion.div
        className="fixed left-0 top-0 flex items-center justify-center rounded-full"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: hidden ? 0 : 1,
          height: label ? 40 : hovering ? 56 : 34,
          width: label ? "auto" : hovering ? 56 : 34,
          paddingLeft: label ? 18 : 0,
          paddingRight: label ? 18 : 0,
          backgroundColor: label
            ? "rgba(45,212,191,0.95)"
            : hovering
              ? "rgba(45,212,191,0.12)"
              : "rgba(45,212,191,0)",
          borderColor: label ? "rgba(45,212,191,0)" : hovering ? "rgba(94,234,212,0.9)" : "rgba(45,212,191,0.55)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <span style={{ borderWidth: label ? 0 : 1 }} className="absolute inset-0 rounded-full border border-teal-300/70" />
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              className="relative whitespace-nowrap font-mono text-xs font-semibold text-[#04130f]"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
