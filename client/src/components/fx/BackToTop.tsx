import { useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUp } from "lucide-react";

/**
 * Floating button that fades in after the user scrolls down, and glides back
 * to the top (via the smooth-scroll anchor handler) when clicked.
 */
export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 700));

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href="#top"
          aria-label="Back to top"
          data-cursor="Top"
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="glass-strong fixed bottom-6 right-6 z-[90] grid h-12 w-12 place-items-center rounded-full text-teal-300 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.6)] transition-colors hover:text-teal-100"
        >
          <ArrowUp className="h-5 w-5" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
