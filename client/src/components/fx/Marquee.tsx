import { type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}

/**
 * Seamless infinite horizontal marquee. Content is duplicated so the
 * -50% keyframe loops without a visible seam. Pauses on hover.
 */
export default function Marquee({ children, reverse, className }: MarqueeProps) {
  return (
    <div className={`marquee-track group relative overflow-hidden ${className ?? ""}`}>
      <div className={`marquee ${reverse ? "marquee-reverse" : ""} gap-4 pr-4`}>
        <div className="flex shrink-0 gap-4">{children}</div>
        <div className="flex shrink-0 gap-4" aria-hidden>
          {children}
        </div>
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
