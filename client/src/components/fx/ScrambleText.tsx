import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** ms between frames */
  speed?: number;
  /** "view" decodes when scrolled into view, "mount" decodes immediately */
  trigger?: "view" | "mount";
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]#$%&*";

/**
 * Letters cascade in from random glyphs and "decode" into the final text —
 * a nod to the competitive-programming/hacker aesthetic. Resolves instantly
 * for reduced-motion users.
 */
export default function ScrambleText({
  text,
  className,
  speed = 35,
  trigger = "view",
}: ScrambleTextProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(reduce ? text : text.replace(/\S/g, " "));

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    if (trigger === "view" && !inView) return;

    let iteration = 0;
    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < iteration) return text[i];
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      iteration += 1 / 2;
      if (iteration >= text.length) {
        clearInterval(id);
        setDisplay(text);
      }
    }, speed);

    return () => clearInterval(id);
  }, [inView, reduce, text, speed, trigger]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
