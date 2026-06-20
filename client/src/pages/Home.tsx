import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  Linkedin,
  Mail,
  ExternalLink,
  Code2,
  Briefcase,
  ArrowRight,
  ArrowUpRight,
  Phone,
  MapPin,
  Star,
  Trophy,
  Target,
  CheckCircle2,
  Cpu,
  GraduationCap,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedBackground from "@/components/fx/AnimatedBackground";
import CustomCursor from "@/components/fx/CustomCursor";
import ScrollProgress from "@/components/fx/ScrollProgress";
import SpotlightCard from "@/components/fx/SpotlightCard";
import Magnetic from "@/components/fx/Magnetic";
import Reveal, { RevealItem } from "@/components/fx/Reveal";
import Counter from "@/components/fx/Counter";
import Marquee from "@/components/fx/Marquee";
import Intro from "@/components/fx/Intro";
import SmoothScroll from "@/components/fx/SmoothScroll";
import ScrambleText from "@/components/fx/ScrambleText";
import VelocityMarquee from "@/components/fx/VelocityMarquee";
import BackToTop from "@/components/fx/BackToTop";
import { LeetCodeIcon, GfgIcon } from "@/components/icons";

/* ----------------------------- Content ----------------------------- */

const NAV = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const JOURNEY_ACCENT = {
  education: {
    node: "border-cyan-400/40 text-cyan-300",
    text: "text-cyan-300",
    chip: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    solid: "bg-cyan-400 text-[#04161a]",
  },
  defense: {
    node: "border-amber-400/50 text-amber-300",
    text: "text-amber-300",
    chip: "border-amber-400/25 bg-amber-400/10 text-amber-200",
    solid: "bg-amber-400 text-[#1a1205]",
  },
  work: {
    node: "border-teal-400/40 text-teal-300",
    text: "text-teal-300",
    chip: "border-teal-400/20 bg-teal-400/10 text-teal-200",
    solid: "bg-teal-400 text-[#04130f]",
  },
} as const;

type Stat = { value: number; suffix?: string; label: string } | { text: string; label: string };

const STATS: Stat[] = [
  { value: 800, suffix: "+", label: "Problems solved" },
  { value: 4, suffix: "+", label: "Projects shipped" },
  { value: 3, suffix: "★", label: "CodeChef" },
  { text: "Pupil", label: "Codeforces" },
];

const FACTS = [
  { icon: MapPin, label: "Based in", value: "Ahmedabad, India" },
  { icon: Briefcase, label: "Currently", value: "Software Dev @ Trusttags" },
  { icon: Cpu, label: "Focus", value: "Backend · Databases · CV" },
  { icon: Code2, label: "Also", value: "Competitive programming" },
];

/** A technology with a locally-hosted Devicon brand logo (client/public/tech/*.svg).
 *  `light` flags logos that are dark/monochrome and need a light tile to stay visible. */
type Tech = { name: string; file: string; light?: boolean };

const TECH: Tech[] = [
  { name: "React", file: "react" },
  { name: "Node.js", file: "nodejs" },
  { name: "Express", file: "express", light: true },
  { name: "MongoDB", file: "mongodb" },
  { name: "PostgreSQL", file: "postgresql" },
  { name: "MySQL", file: "mysql" },
  { name: "Redis", file: "redis" },
  { name: "Python", file: "python" },
  { name: "JavaScript", file: "javascript" },
  { name: "Java", file: "java" },
  { name: "C++", file: "cplusplus" },
  { name: "C", file: "c" },
  { name: "Tailwind", file: "tailwindcss" },
  { name: "Redux", file: "redux" },
  { name: "Bootstrap", file: "bootstrap" },
  { name: "OpenCV", file: "opencv" },
  { name: "Git", file: "git" },
  { name: "Linux", file: "linux" },
  { name: "VS Code", file: "vscode" },
];

/** Rows of decreasing width — rendered as a centered "tech pyramid". */
const TECH_PYRAMID: Tech[][] = [
  [
    { name: "Python", file: "python" },
    { name: "JavaScript", file: "javascript" },
    { name: "Java", file: "java" },
    { name: "C++", file: "cplusplus" },
    { name: "C", file: "c" },
    { name: "HTML", file: "html5" },
  ],
  [
    { name: "CSS", file: "css3" },
    { name: "React", file: "react" },
    { name: "Node.js", file: "nodejs" },
    { name: "Express", file: "express", light: true },
    { name: "Tailwind", file: "tailwindcss" },
  ],
  [
    { name: "Redux", file: "redux" },
    { name: "Bootstrap", file: "bootstrap" },
    { name: "MongoDB", file: "mongodb" },
    { name: "PostgreSQL", file: "postgresql" },
    { name: "MySQL", file: "mysql" },
  ],
  [
    { name: "Redis", file: "redis" },
    { name: "OpenCV", file: "opencv" },
    { name: "Git", file: "git" },
    { name: "GitHub", file: "github", light: true },
  ],
  [
    { name: "Linux", file: "linux" },
    { name: "VS Code", file: "vscode" },
  ],
];

/** Same logos re-chunked into a narrower funnel that fits small screens. */
function chunkByCounts<T>(arr: T[], counts: number[]): T[][] {
  const out: T[][] = [];
  let i = 0;
  for (const c of counts) {
    out.push(arr.slice(i, i + c));
    i += c;
  }
  if (i < arr.length) out.push(arr.slice(i));
  return out;
}
const MOBILE_PYRAMID = chunkByCounts(TECH_PYRAMID.flat(), [4, 4, 4, 3, 3, 2, 2]);

type JourneyKind = "education" | "defense" | "work";

interface JourneyEntry {
  kind: JourneyKind;
  icon: typeof GraduationCap;
  title: string;
  subtitle: string;
  period: string;
  location?: string;
  description: string;
  highlights?: string[];
  badge?: string;
  image?: string;
  imageCaption?: string;
  link?: string;
  current?: boolean;
}

const JOURNEY: JourneyEntry[] = [
  {
    kind: "education",
    icon: GraduationCap,
    title: "Kendriya Vidyalaya, Pragati Vihar",
    subtitle: "Schooling · Class 1–12",
    period: "Early years",
    location: "New Delhi",
    description:
      "Twelve years under one roof — where curiosity for how things work first turned into a habit of building them.",
    image: "/kv.png",
    imageCaption: "Class 1–12 · New Delhi",
  },
  {
    kind: "education",
    icon: GraduationCap,
    title: "Indore Institute of Science & Technology",
    subtitle: "B.Tech · Computer Science",
    period: "Undergraduate",
    location: "Indore",
    description:
      "Studied computer science while going deep on data structures, algorithms and the engineering fundamentals I lean on every day.",
    image: "/iist.png",
    imageCaption: "B.Tech · Indore",
  },
  {
    kind: "defense",
    icon: ShieldCheck,
    title: "Air Force Common Admission Test (AFCAT)",
    subtitle: "SSB Recommended twice",
    period: "Defence selection",
    description:
      "Recommended twice at the Services Selection Board (SSB) — five days of psychology tests, group tasks and interviews that measure leadership and composure under pressure. It's where I learned to stay calm and decisive when the stakes are real.",
    badge: "Recommended",
    image: "/ssb.jpg",
    imageCaption: "SSB Recommended",
  },
  {
    kind: "work",
    icon: Briefcase,
    title: "Zangoh",
    subtitle: "Backend Developer Intern",
    period: "Jul 2024 – Sep 2024 · 2 mos",
    location: "Indore",
    description:
      "Developed and maintained backend services for mobile applications using Node.js and Express, with Redis caching to push down response times.",
    highlights: ["Node.js / Express", "Redis Caching", "API Design"],
    image: "/zangoh.png",
    imageCaption: "Backend Intern",
    link: "https://zangoh.com/",
  },
  {
    kind: "work",
    icon: Briefcase,
    title: "Walkover",
    subtitle: "Software Developer",
    period: "6 months",
    location: "Indore",
    description:
      "Built and shipped features across backend services and web applications, working closely with the team on day-to-day product development.",
    highlights: ["Backend", "Web Development", "Collaboration"],
    image: "/walkover.png",
    imageCaption: "Software Developer",
    link: "https://walkover.in/",
  },
  {
    kind: "work",
    icon: Briefcase,
    title: "Trusttags",
    subtitle: "Software Developer",
    period: "Jun 2025 – Present · ~1 yr",
    location: "Ahmedabad",
    description:
      "Building a scalable Distributor Management System with territory-based pricing and a RAG-powered chatbot, plus computer-vision tooling for industrial inspection.",
    highlights: ["DMS Development", "Table Partitioning", "RAG Chatbot", "Computer Vision"],
    image: "/trusttags.png",
    imageCaption: "Current role",
    link: "https://www.trusttags.in/",
    current: true,
  },
];

const PROJECTS = [
  {
    title: "Campus Connect",
    tag: "Realtime",
    description:
      "Real-time virtual classroom with WebRTC peer-to-peer video/audio and an integrated ChatGPT assistant.",
    technologies: ["Node.js", "React", "WebRTC", "MongoDB", "ChatGPT API"],
    highlights: ["Video/Audio Streaming", "Real-time Chat", "AI Integration"],
  },
  {
    title: "Distributor Management System",
    tag: "Scale",
    description:
      "Scalable DMS for territory-based pricing and order management, tuned with partitioning for heavy query loads.",
    technologies: ["Backend Systems", "DB Optimization", "Table Partitioning"],
    highlights: ["Scalability", "Performance Tuning", "Complex Queries"],
  },
  {
    title: "Vision Inspection Module",
    tag: "Computer Vision",
    description:
      "Bulk 2D inspection system that decodes multiple DataMatrix codes from a single high-resolution image.",
    technologies: ["OpenCV", "Computer Vision", "Python"],
    highlights: ["Image Processing", "Pattern Recognition", "Accuracy Tuning"],
  },
  {
    title: "E-Commerce Platform",
    tag: "Full-Stack",
    description:
      "Full-stack commerce app with browsing, cart, checkout, email notifications and RESTful APIs.",
    technologies: ["Node.js", "React", "Express", "MongoDB", "Nodemailer"],
    highlights: ["RESTful APIs", "Email Notifications", "Responsive UI"],
  },
];

const PROJECT_COVERS = [
  "radial-gradient(120% 120% at 0% 0%, #0f766e 0%, #0a0e16 55%), linear-gradient(120deg, #134e4a, #0a0e16)",
  "radial-gradient(120% 120% at 100% 0%, #155e75 0%, #0a0e16 55%), linear-gradient(120deg, #164e63, #0a0e16)",
  "radial-gradient(120% 120% at 0% 100%, #9a3412 0%, #0a0e16 55%), linear-gradient(120deg, #7c2d12, #0a0e16)",
  "radial-gradient(120% 120% at 100% 100%, #3730a3 0%, #0a0e16 55%), linear-gradient(120deg, #312e81, #0a0e16)",
];

const ACHIEVEMENTS = [
  { title: "3★ on CodeChef", sub: "Peak competitive rating", icon: Star },
  { title: "Pupil on Codeforces", sub: "Consistent contest finishes", icon: Target },
  { title: "800+ problems", sub: "Solved across judges", icon: CheckCircle2 },
  { title: "CP Team Lead", sub: "Mentoring & contests", icon: Trophy },
];

const SOCIALS: { href: string; label: string; icon: ComponentType<{ className?: string }>; color: string }[] = [
  {
    href: "https://www.linkedin.com/in/rishabh-rawat-63517325b/",
    label: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
  },
  {
    href: "https://leetcode.com/u/rawatrishabh/",
    label: "LeetCode",
    icon: LeetCodeIcon,
    color: "#FFA116",
  },
  {
    href: "https://www.geeksforgeeks.org/profile/rawat_rishabh",
    label: "GeeksforGeeks",
    icon: GfgIcon,
    color: "#2F8D46",
  },
];

/* ----------------------------- Hero headline ----------------------------- */

const headlineWords = ["Backend", "Engineer", "building", "systems", "that"];

const headlineContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const headlineWord: Variants = {
  hidden: { opacity: 0, y: "100%", rotateX: -40 },
  show: {
    opacity: 1,
    y: "0%",
    rotateX: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ----------------------------- Typed tagline ----------------------------- */

function TypedRole() {
  const reduce = useReducedMotion();
  const roles = ["scalable backend systems.", "computer-vision tools.", "clean, fast APIs.", "elegant solutions."];
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setText(roles[0]);
      return;
    }
    const current = roles[i % roles.length];
    const delay = deleting ? 45 : 90;
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setI((p) => p + 1);
      return;
    }
    const t = setTimeout(() => {
      setText((prev) =>
        deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1)
      );
    }, delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, deleting, i, reduce]);

  return (
    <span className="font-mono text-teal-300">
      {text}
      <span className="ml-0.5 inline-block w-[2px] translate-y-0.5 bg-teal-300 animate-blink">&nbsp;</span>
    </span>
  );
}

/* ----------------------------- Scroll spy ----------------------------- */

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return active;
}

/* ----------------------------- Page ----------------------------- */

export default function Home() {
  const reduce = useReducedMotion();
  const active = useActiveSection(NAV.map((n) => n.id));
  const [imgError, setImgError] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  // Hero: cursor-following glow + photo 3D tilt
  const glowX = useMotionValue(50);
  const glowY = useMotionValue(30);
  const heroGlow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(600px circle at ${x}% ${y}%, rgba(45,212,191,0.12), transparent 70%)`
  );
  const tiltX = useSpring(0, { stiffness: 120, damping: 12, mass: 0.4 });
  const tiltY = useSpring(0, { stiffness: 120, damping: 12, mass: 0.4 });

  const onHeroMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    glowX.set(x * 100);
    glowY.set(y * 100);
    tiltY.set((x - 0.5) * 16);
    tiltX.set((0.5 - y) * 16);
  };
  const onHeroLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  // Journey: timeline line that draws as you scroll through it
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyProgress } = useScroll({
    target: journeyRef,
    offset: ["start 65%", "end 85%"],
  });
  const lineScale = useSpring(journeyProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-teal-400 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[#04130f]"
      >
        Skip to content
      </a>
      <Intro />
      <SmoothScroll />
      <AnimatedBackground />
      <CustomCursor />
      <ScrollProgress />
      <BackToTop />

      {/* ---------------- Navigation ---------------- */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-0 top-4 z-50 px-4"
      >
        <div className="glass-strong mx-auto flex max-w-5xl items-center justify-between rounded-full px-5 py-2.5 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]">
          <a href="#top" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 font-display text-sm font-bold text-[#04130f]">
              R
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">Rishabh Rawat</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="relative rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {active === item.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </div>

          <Magnetic strength={0.5}>
            <a href="mailto:rishabhrawat479@gmail.com">
              <span className="shine inline-flex items-center gap-1.5 rounded-full bg-teal-400 px-4 py-1.5 text-sm font-semibold text-[#04130f] transition-transform hover:bg-teal-300">
                Hire me
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </Magnetic>
        </div>
      </motion.nav>

      <main id="main">

      {/* ---------------- Hero ---------------- */}
      <section
        id="top"
        ref={heroRef}
        onMouseMove={onHeroMove}
        onMouseLeave={onHeroLeave}
        className="relative px-4 pt-36 pb-24 md:pt-44"
      >
        {!reduce && (
          <motion.div
            aria-hidden
            style={{ background: heroGlow }}
            className="pointer-events-none absolute inset-0"
          />
        )}
        <motion.div
          style={reduce ? undefined : { y: heroY, opacity: heroOpacity }}
          className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-5"
        >
          {/* Left */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3.5 py-1.5 text-xs font-medium text-teal-200"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-300" />
              </span>
              Available for opportunities
            </motion.div>

            <h1 className="font-display text-5xl font-extrabold leading-[1.04] tracking-tight md:text-7xl">
              <motion.span
                variants={headlineContainer}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-x-4"
                style={{ perspective: 800 }}
              >
                {headlineWords.map((w, idx) => (
                  <span key={idx} className="inline-block overflow-hidden pb-1">
                    <motion.span variants={headlineWord} className="inline-block">
                      {w}
                    </motion.span>
                  </span>
                ))}
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="gradient-text text-glow"
              >
                scale.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              I'm Rishabh — a backend engineer & competitive programmer crafting{" "}
              <TypedRole />
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <a href="#projects">
                  <Button className="shine h-12 gap-2 rounded-full bg-teal-400 px-6 text-[#04130f] hover:bg-teal-300">
                    View my work
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </Magnetic>
              <Magnetic>
                <a href="mailto:rishabhrawat479@gmail.com">
                  <Button
                    variant="outline"
                    className="h-12 gap-2 rounded-full border-white/15 bg-white/5 px-6 text-foreground backdrop-blur hover:bg-white/10"
                  >
                    <Mail className="h-4 w-4" />
                    Get in touch
                  </Button>
                </a>
              </Magnetic>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {SOCIALS.map((s) => (
                <Magnetic key={s.label} strength={0.4}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="Visit"
                    aria-label={s.label}
                    style={{ ["--brand" as string]: s.color } as CSSProperties}
                    className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-teal-400/40 hover:text-foreground"
                  >
                    <s.icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-[var(--brand)]" />
                    <span>{s.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </a>
                </Magnetic>
              ))}
            </motion.div>
          </div>

          {/* Right: photo */}
          <motion.div
            style={reduce ? undefined : { y: photoY }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative order-first mx-auto md:order-none md:col-span-2"
          >
            <motion.div
              style={
                reduce ? undefined : { rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }
              }
              className="relative mx-auto aspect-square w-52 sm:w-64 md:w-72 lg:w-80"
            >
              {/* glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-400/40 to-orange-400/30 blur-3xl" />
              {/* rotating dashed ring */}
              <div className="absolute -inset-4 rounded-full border border-dashed border-teal-400/30 animate-spin-slow" />
              {/* conic ring */}
              <div
                className="absolute -inset-1 rounded-full animate-spin-slow"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent, rgba(45,212,191,0.7), transparent 40%, rgba(251,146,60,0.6), transparent 70%)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))",
                }}
              />
              <div className="relative h-full w-full overflow-hidden rounded-full border border-white/10 shadow-2xl">
                {imgError ? (
                  <div className="grid h-full w-full place-items-center bg-gradient-to-br from-teal-500/30 via-[#0a0e16] to-orange-500/20">
                    <span className="font-display text-6xl font-extrabold gradient-text-static">RR</span>
                  </div>
                ) : (
                  <img
                    src="/profile.png"
                    alt="Rishabh Rawat"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {/* floating chips (hidden on the smallest screens to avoid overflow) */}
              <div className="absolute -left-6 top-10 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0a0e16]/80 px-3 py-2 text-xs font-medium backdrop-blur animate-bob sm:flex">
                <Briefcase className="h-3.5 w-3.5 text-teal-300" />
                Software Dev @ Trusttags
              </div>
              <div
                className="absolute -right-4 bottom-12 hidden items-center gap-2 rounded-xl border border-white/10 bg-[#0a0e16]/80 px-3 py-2 text-xs font-medium backdrop-blur animate-bob sm:flex"
                style={{ animationDelay: "0.6s" }}
              >
                <MapPin className="h-3.5 w-3.5 text-orange-300" />
                Ahmedabad, India
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 flex flex-col items-center gap-2 text-xs text-muted-foreground"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="h-4 w-4 animate-bob" />
        </motion.div>
      </section>

      {/* ---------------- Stats ---------------- */}
      <section className="px-4 py-10">
        <Reveal stagger={0.12} className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map((s) => (
            <RevealItem key={s.label}>
              <div className="glass group rounded-2xl px-4 py-6 text-center transition-colors hover:border-teal-400/30">
                <div className="font-display text-3xl font-bold gradient-text-static md:text-4xl">
                  {"text" in s ? s.text : <Counter to={s.value} suffix={s.suffix} />}
                </div>
                <div className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  className="mx-auto mt-3 h-0.5 w-10 origin-center rounded-full bg-gradient-to-r from-teal-400 to-orange-400 opacity-70"
                />
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* ---------------- Tech logo marquee ---------------- */}
      <section className="py-8">
        <Marquee className="py-2">
          {TECH.map((t) => (
            <div
              key={t.name}
              title={t.name}
              className={`mx-1.5 grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-white/10 p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-teal-400/40 hover:shadow-[0_10px_30px_-8px_rgba(45,212,191,0.5)] ${
                t.light ? "bg-white" : "bg-white/[0.06]"
              }`}
            >
              <img
                src={`/tech/${t.file}.svg`}
                alt={t.name}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </Marquee>
      </section>

      {/* ---------------- Competitive Programming ---------------- */}
      <section className="px-4 pt-12 pb-4">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <SpotlightCard className="glass p-6 md:p-8" tilt={4}>
              <div className="grid items-center gap-8 md:grid-cols-2">
                {/* Copy */}
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal-300/80">
                    Competitive Programming
                  </p>
                  <h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">
                    800+ problems, and counting
                  </h3>
                  <p className="mt-3 text-muted-foreground">
                    DSA is my daily warm-up. I solve consistently across LeetCode,
                    GeeksforGeeks, CodeChef and Codeforces — it's where I keep my
                    problem-solving sharp and my fundamentals honest.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Magnetic>
                      <a
                        href="https://leetcode.com/u/rawatrishabh/"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="Visit"
                      >
                        <span className="shine inline-flex items-center gap-2 rounded-full bg-teal-400 px-5 py-2.5 text-sm font-semibold text-[#04130f] transition-colors hover:bg-teal-300">
                          <LeetCodeIcon className="h-4 w-4" />
                          View LeetCode profile
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                      </a>
                    </Magnetic>
                    <a
                      href="https://www.geeksforgeeks.org/profile/rawat_rishabh"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="Visit"
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-teal-400/40 hover:text-foreground"
                    >
                      <GfgIcon className="h-4 w-4" />
                      GeeksforGeeks
                    </a>
                  </div>
                </div>

                {/* Stats screenshot */}
                <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0e16]">
                  <img
                    src="/leetcode.png"
                    alt="Rishabh Rawat — LeetCode profile stats"
                    loading="lazy"
                    className="w-full"
                  />
                  <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0a0e16]/85 px-3 py-1 text-xs font-medium text-amber-200 backdrop-blur">
                    <LeetCodeIcon className="h-3.5 w-3.5" />
                    @rawatrishabh
                  </span>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </section>

      {/* ---------------- About ---------------- */}
      <section id="about" className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="01 — About" title="A bit about me" />

          <div className="mt-12 grid gap-8 md:grid-cols-5">
            <Reveal direction="right" className="md:col-span-3">
              <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                <p>
                  I'm a backend engineer who's drawn to the parts of software people
                  never see — data models that hold up, queries that stay fast under
                  load, and APIs that are{" "}
                  <span className="text-foreground">boring to use in the best way</span>.
                </p>
                <p>
                  Right now I'm building a Distributor Management System at{" "}
                  <span className="text-teal-300">Trusttags</span> — working through
                  territory-based pricing, table partitioning for scale, and a
                  RAG-based assistant, with the occasional detour into computer vision.
                </p>
                <p>
                  Away from work I'm usually deep in a contest. Competitive programming
                  is where I sharpen the problem-solving that ends up in everything I
                  ship — and where I learned that the cleanest solution is almost always
                  worth the extra think.
                </p>
              </div>
            </Reveal>

            <Reveal direction="left" delay={0.1} className="md:col-span-2">
              <div className="glass rounded-2xl p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-teal-300/80">
                  Quick facts
                </p>
                <div className="space-y-4">
                  {FACTS.map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5 text-teal-300">
                        <f.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">{f.label}</p>
                        <p className="text-sm font-medium text-foreground">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Journey ---------------- */}
      <section id="journey" className="px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <SectionHeading kicker="02 — Journey" title="My journey so far" />
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              From a classroom in Delhi to engineering teams across India — with a
              detour through the Services Selection Board along the way.
            </p>
          </Reveal>

          <div className="relative mt-12" ref={journeyRef}>
            {/* timeline track + scroll-drawn line */}
            <div className="absolute left-[19px] top-3 bottom-3 hidden w-px bg-white/10 md:block" />
            <motion.div
              style={reduce ? undefined : { scaleY: lineScale }}
              className="absolute left-[19px] top-3 bottom-3 hidden w-px origin-top bg-gradient-to-b from-cyan-400 via-teal-400 to-orange-400 md:block"
            />
            <div className="space-y-6">
              {JOURNEY.map((e, idx) => {
                const accent = JOURNEY_ACCENT[e.kind];
                return (
                  <Reveal
                    key={idx}
                    direction="up"
                    delay={Math.min(idx, 4) * 0.04}
                    className="relative md:pl-16"
                  >
                    {/* timeline node (desktop) — pops as it scrolls in */}
                    <motion.span
                      initial={{ scale: 0.4, opacity: 0.3 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ type: "spring", stiffness: 260, damping: 16 }}
                      className={`absolute left-0 top-1 hidden h-10 w-10 place-items-center rounded-full border bg-background shadow-[0_0_0_5px_rgba(45,212,191,0.07)] md:grid ${accent.node}`}
                    >
                      <e.icon className="h-5 w-5" />
                    </motion.span>

                    <SpotlightCard className="glass p-6 md:p-7" tilt={5}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          {/* icon (mobile) */}
                          <span
                            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border md:hidden ${accent.node}`}
                          >
                            <e.icon className="h-5 w-5" />
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="font-display text-xl font-bold">
                                {e.link ? (
                                  <a
                                    href={e.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-cursor="Visit"
                                    className="group/link inline-flex items-center gap-1.5 transition-colors hover:text-teal-200"
                                  >
                                    {e.title}
                                    <ArrowUpRight className="h-4 w-4 -translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100" />
                                  </a>
                                ) : (
                                  e.title
                                )}
                              </h3>
                              {e.current && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-400/15 px-2.5 py-0.5 text-xs font-semibold text-teal-200 ring-1 ring-teal-400/30">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-pulse-ring" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal-300" />
                                  </span>
                                  Now
                                </span>
                              )}
                              {e.badge && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2.5 py-0.5 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/30">
                                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
                                  {e.badge}
                                </span>
                              )}
                            </div>
                            <p className={`font-medium ${accent.text}`}>{e.subtitle}</p>
                          </div>
                        </div>
                        <div className="hidden shrink-0 text-right text-sm text-muted-foreground sm:block">
                          <p className="font-mono">{e.period}</p>
                          {e.location && (
                            <p className="flex items-center justify-end gap-1">
                              <MapPin className="h-3 w-3" />
                              {e.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* mobile period */}
                      <p className="mt-2 font-mono text-xs text-muted-foreground sm:hidden">
                        {e.period}
                        {e.location ? ` · ${e.location}` : ""}
                      </p>

                      {/* Milestone image */}
                      {e.image &&
                        (e.kind === "defense" ? (
                          // Full photo (AFCAT / SSB)
                          <div className="relative mt-4 overflow-hidden rounded-xl border border-white/10">
                            <img
                              src={e.image}
                              alt={`${e.title} — ${e.subtitle}`}
                              loading="lazy"
                              className="block w-full"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e16] via-transparent to-transparent" />
                            {e.imageCaption && (
                              <span
                                className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${accent.solid}`}
                              >
                                {e.imageCaption}
                              </span>
                            )}
                          </div>
                        ) : (
                          // Small logo for school / college / company
                          <div className="mt-4 flex items-center gap-3">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white sm:h-20 sm:w-20">
                              <img
                                src={e.image}
                                alt={`${e.title} logo`}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            {e.imageCaption && (
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${accent.chip}`}
                              >
                                {e.imageCaption}
                              </span>
                            )}
                          </div>
                        ))}

                      <p className="mt-3 text-muted-foreground">{e.description}</p>

                      {e.highlights && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {e.highlights.map((h) => (
                            <span
                              key={h}
                              className={`rounded-full border px-3 py-1 text-xs font-medium ${accent.chip}`}
                            >
                              {h}
                            </span>
                          ))}
                        </div>
                      )}
                    </SpotlightCard>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Projects ---------------- */}
      <section id="projects" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker="03 — Selected work" title="Featured projects" />

          <Reveal stagger={0.1} className="mt-12 grid gap-6 md:grid-cols-2">
            {PROJECTS.map((project, idx) => (
              <RevealItem key={project.title}>
                <SpotlightCard className="glass h-full overflow-hidden" data-cursor="Open">
                  {/* Generative cover */}
                  <div className="relative h-36 overflow-hidden">
                    <div
                      className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ background: PROJECT_COVERS[idx % PROJECT_COVERS.length] }}
                    >
                      <div className="grid-bg absolute inset-0 opacity-40" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e16] to-transparent" />
                    {/* sheen sweep on hover */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span className="absolute left-5 top-3 font-display text-7xl font-extrabold text-white/10">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-3 left-5 rounded-full bg-black/30 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white backdrop-blur">
                      {project.tag}
                    </span>
                    <ExternalLink className="absolute right-5 top-4 h-5 w-5 text-white/80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>

                  <div className="p-6 md:p-7">
                    <h3 className="font-display text-2xl font-bold transition-colors group-hover:text-teal-200">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {project.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 border-t border-white/10 pt-4">
                      {project.highlights.map((h) => (
                        <span key={h} className="text-xs text-teal-300/90">
                          ▹ {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------------- Kinetic type band ---------------- */}
      <section className="relative py-16 md:py-24" aria-hidden>
        <div className="pointer-events-none select-none space-y-2 md:space-y-4">
          <VelocityMarquee
            items={["BACKEND ENGINEER", "COMPETITIVE PROGRAMMER", "PROBLEM SOLVER"]}
            baseVelocity={2.4}
          />
          <VelocityMarquee
            items={["SCALABLE SYSTEMS", "COMPUTER VISION", "CLEAN APIS", "FAST QUERIES"]}
            baseVelocity={-2}
          />
        </div>
      </section>

      {/* ---------------- Skills ---------------- */}
      <section id="skills" className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading kicker="04 — Toolkit" title="Skills & technologies" />

          <Reveal className="mt-12">
            {/* Mobile: narrower funnel that fits the screen — full-color icons (no hover) */}
            <div className="flex flex-col items-center gap-2 sm:hidden">
              {MOBILE_PYRAMID.map((row, i) => (
                <div key={i} className="flex justify-center gap-2">
                  {row.map((t) => (
                    <PyramidTile key={t.name} tech={t} />
                  ))}
                </div>
              ))}
            </div>

            {/* Desktop: wide pyramid (rows stay single-line) */}
            <div className="hidden flex-col items-center gap-4 sm:flex">
              {TECH_PYRAMID.map((row, i) => (
                <div key={i} className="flex justify-center gap-3 md:gap-4">
                  {row.map((t) => (
                    <PyramidTile key={t.name} tech={t} />
                  ))}
                </div>
              ))}
            </div>
          </Reveal>

          {/* Achievements */}
          <Reveal stagger={0.08} className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {ACHIEVEMENTS.map((a) => (
              <RevealItem key={a.title}>
                <div className="glass cursor-grow group flex h-full flex-col gap-3 rounded-2xl p-5 transition-transform hover:-translate-y-1">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-400/12 text-teal-300 transition-colors group-hover:bg-teal-400/20">
                    <a.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold leading-tight">{a.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{a.sub}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Reveal>

        </div>
      </section>

      {/* ---------------- Contact ---------------- */}
      <section id="contact" className="px-4 py-24">
        <Reveal className="mx-auto max-w-4xl">
          <div className="border-glow glass-strong relative overflow-hidden rounded-3xl px-6 py-16 text-center md:px-12">
            <div className="absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-teal-400/30 blur-3xl" />
            <div className="relative">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-muted-foreground">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75 animate-pulse-ring" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-300" />
                </span>
                Available · Remote or Ahmedabad
              </span>
              <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
                Got a problem worth <span className="gradient-text">solving?</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Open to backend roles, freelance work, or just a sharp engineering
                conversation. I read every message and usually reply within a day.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Magnetic>
                  <a href="mailto:rishabhrawat479@gmail.com" data-cursor="Say hi">
                    <Button className="shine h-12 gap-2 rounded-full bg-teal-400 px-7 text-[#04130f] hover:bg-teal-300">
                      <Mail className="h-4 w-4" />
                      rishabhrawat479@gmail.com
                    </Button>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a href="tel:+918810508467">
                    <Button
                      variant="outline"
                      className="h-12 gap-2 rounded-full border-white/15 bg-white/5 px-7 hover:bg-white/10"
                    >
                      <Phone className="h-4 w-4" />
                      +91 8810508467
                    </Button>
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      </main>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-white/10 px-4 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Rishabh Rawat · Designed & built in Ahmedabad, India.</p>
          <LocalClock />
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-teal-300"
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------------------- Shared bits ----------------------------- */

function PyramidTile({ tech }: { tech: Tech }) {
  return (
    <div
      title={tech.name}
      className="group/tech flex w-[20vw] max-w-24 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-1.5 py-3 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-teal-400/50 hover:bg-white/[0.06] hover:shadow-[0_14px_34px_-12px_rgba(45,212,191,0.55)] sm:w-24 sm:gap-2.5 sm:px-2 sm:py-4"
    >
      <img
        src={`/tech/${tech.file}.svg`}
        alt={tech.name}
        loading="lazy"
        className={`h-7 w-7 object-contain transition duration-300 group-hover/tech:scale-110 sm:h-8 sm:w-8 ${
          tech.light
            ? "opacity-90 [filter:brightness(0)_invert(1)]"
            : "opacity-100 sm:opacity-80 sm:[filter:brightness(0)_invert(1)] sm:group-hover/tech:opacity-100 sm:group-hover/tech:[filter:none]"
        }`}
      />
      <span className="w-full truncate text-[10px] font-medium text-muted-foreground transition-colors group-hover/tech:text-foreground sm:text-[11px]">
        {tech.name}
      </span>
    </div>
  );
}

function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
  return (
    <span className="flex items-center gap-2 font-mono text-xs">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
      {time} IST · Ahmedabad
    </span>
  );
}

function SectionHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal>
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-teal-300/80">{kicker}</p>
      <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
        <ScrambleText text={title} />
      </h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="mt-4 h-1 w-20 origin-left rounded-full bg-gradient-to-r from-teal-400 to-orange-400"
      />
    </Reveal>
  );
}
