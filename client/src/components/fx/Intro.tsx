import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Cinematic first-load overlay: a count from 00 → 100 with the wordmark,
 * then the panels split away to reveal the page. Shows once per mount and
 * is skipped entirely for reduced-motion users.
 */
export default function Intro() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    // lock scroll while the intro plays
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const DURATION = 1900;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      // ease-out for a snappier finish
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 350);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [reduce]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#05070d]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 font-display text-2xl font-extrabold text-[#04130f]">
              R
            </span>
            <p className="font-mono text-sm uppercase tracking-[0.35em] text-muted-foreground">
              Rishabh Rawat
            </p>
          </motion.div>

          {/* progress count */}
          <div className="absolute bottom-10 left-0 right-0 flex items-end justify-between px-8 md:px-16">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Loading
            </span>
            <span className="font-display text-6xl font-extrabold leading-none gradient-text-static md:text-8xl">
              {String(count).padStart(3, "0")}
            </span>
          </div>

          {/* progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-gradient-to-r from-teal-300 to-orange-400"
            style={{ width: `${count}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
