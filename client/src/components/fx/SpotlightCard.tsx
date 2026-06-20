import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt in degrees. */
  tilt?: number;
  /** Optional label shown by the custom cursor on hover. */
  "data-cursor"?: string;
}

/**
 * Glass card that tilts in 3D toward the pointer and reveals a soft
 * radial "spotlight" that tracks the cursor across its surface.
 */
export default function SpotlightCard({
  children,
  className,
  tilt = 8,
  ...rest
}: SpotlightCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // pointer position (0–1) within the card
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [tilt, -tilt]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-tilt, tilt]), {
    stiffness: 200,
    damping: 20,
  });

  // spotlight position in px, smoothed (spring follows the raw source values)
  const sxRaw = useMotionValue(0);
  const syRaw = useMotionValue(0);
  const sx = useSpring(sxRaw, { stiffness: 300, damping: 30 });
  const sy = useSpring(syRaw, { stiffness: 300, damping: 30 });
  const spotlight = useTransform(
    [sx, sy],
    ([lx, ly]) =>
      `radial-gradient(420px circle at ${lx}px ${ly}px, rgba(45,212,191,0.16), transparent 60%)`
  );

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    px.set(lx / rect.width);
    py.set(ly / rect.height);
    sxRaw.set(lx);
    syRaw.set(ly);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      {...rest}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      className={cn(
        "border-glow group relative overflow-hidden rounded-2xl",
        className
      )}
    >
      {/* Spotlight layer */}
      {!reduce && (
        <motion.div
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
      <div style={{ transform: "translateZ(40px)" }} className="relative h-full">
        {children}
      </div>
    </motion.div>
  );
}
