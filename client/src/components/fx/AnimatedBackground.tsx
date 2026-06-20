import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

/**
 * Fixed, full-screen ambient background:
 *  - drifting aurora blobs (CSS)
 *  - a faint grid
 *  - an interactive particle "constellation" drawn on canvas that links
 *    nearby points and gently reacts to the pointer.
 * Falls back to a static gradient when reduced motion is requested.
 */
export default function AnimatedBackground() {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(90, Math.floor((w * h) / 16000));
      particles.length = 0;
      for (let i = 0; i < target; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.6 + 0.6,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const LINK_DIST = 130;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        // gentle attraction toward the pointer
        const dxm = mouse.x - p.x;
        const dym = mouse.y - p.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 180 && dm > 0.001) {
          const force = (180 - dm) / 180;
          p.vx += (dxm / dm) * force * 0.02;
          p.vy += (dym / dm) * force * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;

        // friction + wrap-around
        p.vx *= 0.99;
        p.vy *= 0.99;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(94, 234, 212, 0.7)";
        ctx.fill();
      }

      // links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.22;
            ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Aurora blobs */}
      <div className="aurora-blob animate-float-slow left-[-10%] top-[-10%] h-[42vw] w-[42vw] bg-teal-500/30" />
      <div className="aurora-blob animate-float-slow-2 right-[-12%] top-[8%] h-[38vw] w-[38vw] bg-cyan-500/25" />
      <div className="aurora-blob animate-float-slow bottom-[-14%] left-[25%] h-[40vw] w-[40vw] bg-orange-500/20" />

      {/* Grid overlay */}
      <div className="grid-bg absolute inset-0" />

      {/* Particle constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      {/* Vignette to keep edges grounded */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(5,7,13,0.85)_100%)]" />

      {/* Fine film grain for a premium, less "flat" surface */}
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}
