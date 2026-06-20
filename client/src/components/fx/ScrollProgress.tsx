import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin gradient bar pinned to the top of the viewport that tracks
 * overall page scroll progress.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[100] h-[3px] w-full origin-left bg-gradient-to-r from-teal-300 via-cyan-400 to-orange-400 shadow-[0_0_12px_rgba(45,212,191,0.7)]"
    />
  );
}
