import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  /** Render as a stagger container; direct children should use <RevealItem>. */
  stagger?: number;
  once?: boolean;
}

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
  none: {},
};

/**
 * Scroll-triggered entrance wrapper. Animates once into view, and can act as
 * a stagger parent for <RevealItem> children when `stagger` is provided.
 */
export default function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  stagger,
  once = true,
}: RevealProps) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offset[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: stagger
        ? { staggerChildren: stagger, delayChildren: delay }
        : { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offset[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
