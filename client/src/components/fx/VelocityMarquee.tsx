import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  wrap,
} from "framer-motion";

interface VelocityMarqueeProps {
  items: string[];
  baseVelocity?: number;
  className?: string;
}

/**
 * Oversized typographic band that auto-scrolls, speeds up with scroll
 * velocity, and reverses direction based on scroll direction — the classic
 * "kinetic type" award-site moment. Falls back to a static row when reduced
 * motion is requested.
 */
export default function VelocityMarquee({
  items,
  baseVelocity = 3,
  className,
}: VelocityMarqueeProps) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const Row = (
    <span className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6">{item}</span>
          <span className="text-teal-400">✦</span>
        </span>
      ))}
    </span>
  );

  if (reduce) {
    return (
      <div className={`overflow-hidden ${className ?? ""}`}>
        <div className="flex whitespace-nowrap font-display text-5xl font-extrabold text-outline md:text-7xl">
          {Row}
        </div>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        style={{ x }}
        className="flex whitespace-nowrap font-display text-5xl font-extrabold text-outline md:text-7xl"
      >
        {Row}
        {Row}
        {Row}
        {Row}
      </motion.div>
    </div>
  );
}
