/**
 * Homepage 2 — "The Gallery of Blocks" (Monochrome Black & White Edition)
 * Preserves the cinematic block-by-block flow & scroll choreography in pure black and white.
 */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  MotionValue,
} from "motion/react";
import { ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

/* ------------------------------------------------------------------ */
/* 1. HERO — block-by-block mosaic reveal + scroll framing             */
/* ------------------------------------------------------------------ */

const COLS = 12;
const ROWS = 7;

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });

  const inset = useTransform(p, [0, 0.6], [0, 9]);
  const radius = useTransform(p, [0, 0.6], [0, 28]);
  const clip = useTransform([inset, radius] as MotionValue<number>[], ([i, r]: number[]) => `inset(${i}% ${i}% ${i}% ${i}% round ${r}px)`);
  const imgScale = useTransform(p, [0, 1], [1.15, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-60%"]);
  const titleOpacity = useTransform(p, [0, 0.55], [1, 0]);
  const spread = useTransform(p, [0, 0.6], ["-0.04em", "0.12em"]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const imgX = useTransform(sx, (v) => v * -18);
  const imgY = useTransform(sy, (v) => v * -18);

  const delays = useMemo(
    () =>
      Array.from({ length: COLS * ROWS }, (_, i) => {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        const d = Math.hypot(c - COLS / 2, r - ROWS / 2);
        return 0.15 + d * 0.06 + Math.random() * 0.35;
      }),
    []
  );

  return (
    <section
      ref={ref}
      className="relative h-[200vh] bg-white"
      onMouseMove={(e) => {
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Framed image */}
        <motion.div style={{ clipPath: clip }} className="absolute inset-0">
          <motion.img
            src="/images/hero-luxury-interior.jpg"
            alt="IAN ART mosaic installation"
            style={{ scale: imgScale, x: imgX, y: imgY }}
            className="absolute inset-[-3%] h-[106%] w-[106%] object-cover grayscale contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/30 to-black/85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.75)_100%)]" />

          {/* Mosaic tiles that flip away block by block */}
          <div
            className="pointer-events-none absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)`, perspective: 1200 }}
          >
            {delays.map((d, i) => (
              <motion.div
                key={i}
                className="bg-black border border-white/[0.04]"
                initial={{ rotateX: 0, opacity: 1 }}
                animate={{ rotateX: -95, opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE, delay: d }}
                style={{ transformOrigin: "top" }}
              />
            ))}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          style={{ y: titleY, opacity: titleOpacity }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}>
            <Eyebrow light className="justify-center mb-8">Ian Art Albertyn · Cape Town</Eyebrow>
          </motion.div>

          <motion.h1
            style={{ letterSpacing: spread }}
            className="font-display font-black uppercase leading-[0.82] text-[18vw] md:text-[13vw] text-white"
          >
            <SplitReveal text="IAN ART" delay={1.1} stagger={0.06} />
          </motion.h1>

          <div className="mt-4 md:mt-2 font-serif italic text-3xl sm:text-5xl md:text-7xl text-white">
            <SplitReveal text="building dreams," delay={1.6} stagger={0.025} />{" "}
            <span className="text-white/65">
              <SplitReveal text="block by block" delay={2.0} stagger={0.025} />
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1, ease: EASE }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-5"
          >
            <Magnetic>
              <Link
                to="/virtual-gallery"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-9 py-4 text-[11px] font-extrabold uppercase tracking-[0.3em] text-black"
              >
                <span className="absolute inset-0 translate-y-full bg-zinc-200 transition-transform duration-500 ease-out group-hover:translate-y-0" />
                <span className="relative">Enter the Gallery</span>
                <ArrowUpRight size={16} className="relative transition-transform duration-500 group-hover:rotate-45" />
              </Link>
            </Magnetic>
            <a
              href="#manifesto"
              className="group inline-flex items-center gap-3 rounded-full border border-white/30 px-9 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white/85 backdrop-blur-md transition-colors hover:border-white hover:text-white"
            >
              Discover the story
            </a>
          </motion.div>
        </motion.div>

        {/* Corner meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="absolute bottom-8 left-6 md:left-12 z-10 hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/60"
        >
          Est. 1982 — Wooden block mosaics
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.8 }}
          className="absolute bottom-8 right-6 md:right-12 z-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/60"
        >
          Scroll
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
            <ArrowDown size={14} />
          </motion.span>
        </motion.div>
        <Grain />
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 2. Manifesto — scroll-scrubbed word reveal with floating artworks   */
/* ------------------------------------------------------------------ */

const Word: React.FC<{ word: string; range: [number, number]; progress: MotionValue<number>; accent?: boolean }> = ({
  word,
  range,
  progress,
  accent,
}) => {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [12, 0]);
  return (
    <motion.span
      style={{ opacity, y }}
      className={`inline-block mr-[0.25em] text-black ${accent ? "font-serif italic font-normal" : ""}`}
    >
      {word}
    </motion.span>
  );
};

const MANIFESTO =
  "Every *block* is a decision. Thousands of them, placed by hand, become a *face*, a *memory*, a *movement*. This is art that asks you to step back — and then step *closer*.";

const Manifesto = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.6"] });
  const words = MANIFESTO.split(" ");

  const { scrollYProgress: par } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(par, [0, 1], [120, -220]);
  const y2 = useTransform(par, [0, 1], [-60, 260]);
  const y3 = useTransform(par, [0, 1], [200, -160]);
  const r1 = useTransform(par, [0, 1], [-8, 6]);
  const r2 = useTransform(par, [0, 1], [10, -4]);

  return (
    <section id="manifesto" ref={ref} className="relative overflow-hidden bg-white px-6 py-28 sm:py-36 md:py-56 text-black">
      {/* floating artworks */}
      <motion.img
        src="/faces/WhatsApp-Image-2023-08-08-at-21.31.54.jpeg"
        style={{ y: y1, rotate: r1 }}
        className="absolute left-[2%] top-[6%] w-24 sm:w-32 md:w-56 aspect-[3/4] object-cover rounded-xl opacity-25 md:opacity-85 grayscale hover:grayscale-0 transition-[filter] duration-700 shadow-2xl pointer-events-none md:pointer-events-auto"
        alt=""
      />
      <motion.img
        src="/images/installations/robert-sobukwe-1.jpeg"
        style={{ y: y2, rotate: r2 }}
        className="absolute right-[2%] top-[4%] w-28 sm:w-36 md:w-64 aspect-square object-cover rounded-xl opacity-25 md:opacity-85 grayscale hover:grayscale-0 transition-[filter] duration-700 shadow-2xl pointer-events-none md:pointer-events-auto"
        alt=""
      />
      <motion.img
        src="/images/installations/marc-lottering-1.jpeg"
        style={{ y: y3 }}
        className="absolute bottom-[2%] right-[18%] hidden md:block w-48 aspect-[4/5] object-cover rounded-xl opacity-75 grayscale hover:grayscale-0 transition-[filter] duration-700 shadow-2xl"
        alt=""
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <Eyebrow className="mb-8 md:mb-12">The Manifesto</Eyebrow>
        <p className="font-display font-bold leading-[1.12] md:leading-[1.08] tracking-tight text-3xl sm:text-5xl md:text-7xl">
          {words.map((w, i) => {
            const accent = w.includes("*");
            const clean = w.replace(/\*/g, "");
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={i} word={clean} range={[start, end]} progress={scrollYProgress} accent={accent} />;
          })}
        </p>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 3. Pinned horizontal gallery                                        */
/* ------------------------------------------------------------------ */

const WORKS = [
  { src: "/images/installations/world-map-freedom36.png", title: "World Map", sub: "Freedom 36", year: "2023" },
  { src: "/images/installations/robert-sobukwe-2.jpeg", title: "Robert Sobukwe", sub: "Heritage Tribute", year: "2023" },
  { src: "/images/installations/marc-lottering-2.jpeg", title: "Marc Lottering", sub: "Portrait Series", year: "2022" },
  { src: "/images/installations/blackbrick-imagination-1.jpeg", title: "Blackbrick", sub: "Imagination", year: "2022" },
  { src: "/images/installations/red-cross-1.jpeg", title: "Red Cross", sub: "Children's Hospital", year: "2021" },
  { src: "/images/mandela-mosaic.jpg", title: "Madiba", sub: "Mosaic Portrait", year: "2019" },
  { src: "/images/installations/general-installations-1.jpeg", title: "Private Estate", sub: "Commission", year: "2024" },
];

const WorkCard: React.FC<{ w: (typeof WORKS)[number]; i: number; progress: MotionValue<number> }> = ({ w, i, progress }) => {
  const imgX = useTransform(progress, [0, 1], ["-12%", "12%"]);
  return (
    <motion.article
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE, delay: (i % 3) * 0.08 }}
      className={`group relative shrink-0 w-[72vw] sm:w-[52vw] md:w-[36vw] lg:w-[30vw] ${i % 2 ? "mt-6 md:mt-24" : ""}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.09)]">
        <motion.img
          src={w.src}
          alt={w.title}
          style={{ x: imgX, scale: 1.3 }}
          className="absolute inset-0 h-full w-full object-cover grayscale-[65%] transition-[filter] duration-700 group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-white/90 backdrop-blur-md">
          {String(i + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}
        </div>
        <div className="absolute right-5 top-5 flex h-11 w-11 scale-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:scale-100">
          <ArrowUpRight size={18} />
        </div>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div>
          <h3 className="font-display text-2xl md:text-3xl font-black uppercase tracking-tight text-black">
            {w.title}
          </h3>
          <p className="font-serif italic text-lg text-black/55">{w.sub}</p>
        </div>
        <span className="font-display text-sm font-bold tracking-widest text-black/35">{w.year}</span>
      </div>
    </motion.article>
  );
};

const HorizontalGallery = () => {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 26, mass: 0.3 });
  const x = useTransform(p, [0, 1], [0, -distance]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const bgText = useTransform(p, [0, 1], ["10%", "-40%"]);

  return (
    <section id="gallery" ref={ref} style={{ height: `calc(100vh + ${distance}px)` }} className="relative bg-white text-black">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          style={{ x: bgText }}
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[28vw] font-black uppercase leading-none text-black/[0.03]"
        >
          Selected Works · Selected Works
        </motion.div>

        <div className="relative z-10 mb-6 md:mb-10 flex items-end justify-between px-6 md:px-16">
          <div>
            <Eyebrow className="mb-3 md:mb-4">Selected Works</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter text-black">
              Portraits <span className="font-serif font-normal italic normal-case text-black/60">in</span> wood
            </h2>
          </div>
          <Link to="/commissioned-works" className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-black/60 hover:text-black">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>

        <motion.div ref={trackRef} style={{ x }} className="relative z-10 flex items-start gap-8 md:gap-12 px-6 md:px-16 w-max">
          {WORKS.map((w, i) => (
            <WorkCard key={i} w={w} i={i} progress={p} />
          ))}
          <Link
            to="/virtual-gallery"
            className="group flex shrink-0 w-[60vw] md:w-[24vw] aspect-[4/5] flex-col items-center justify-center gap-6 rounded-[22px] border border-black/15 bg-zinc-50 hover:border-black/40 transition-colors"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-black text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-90">
              <Plus size={34} />
            </div>
            <span className="font-serif italic text-3xl text-black">Walk the 3D gallery</span>
          </Link>
        </motion.div>

        <div className="relative z-10 mx-6 md:mx-16 mt-12 h-px bg-black/10">
          <motion.div style={{ width: bar }} className="h-px bg-black" />
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 4. Portal — circle clip expands into a full-bleed artwork           */
/* ------------------------------------------------------------------ */

const Portal = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });
  const r = useTransform(p, [0, 0.55], [9, 80]);
  const clip = useTransform(r, (v) => `circle(${v}% at 50% 50%)`);
  const scale = useTransform(p, [0, 0.6], [1.5, 1]);
  const rotate = useTransform(p, [0, 0.6], [-12, 0]);
  const outerTextScale = useTransform(p, [0, 0.4], [1, 2.4]);
  const outerTextOpacity = useTransform(p, [0, 0.35], [1, 0]);
  const quoteOpacity = useTransform(p, [0.55, 0.75], [0, 1]);
  const quoteY = useTransform(p, [0.55, 0.75], [40, 0]);

  return (
    <section ref={ref} className="relative h-[260vh] bg-white">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.h2
          style={{ scale: outerTextScale, opacity: outerTextOpacity }}
          className="pointer-events-none absolute z-0 text-center font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tighter text-black"
        >
          Step <br />
          <span className="font-serif font-normal italic normal-case text-black/60">inside</span>
        </motion.h2>

        <motion.div style={{ clipPath: clip }} className="absolute inset-0 z-10">
          <motion.img
            src="/images/exhibition-panorama.jpg"
            alt="Exhibition"
            style={{ scale, rotate }}
            className="h-full w-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-black/50" />
          <motion.div
            style={{ opacity: quoteOpacity, y: quoteY }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <p className="max-w-4xl font-serif italic text-4xl md:text-7xl leading-[1.05] text-white">
              “An artist is someone with the gift to light a dark room.”
            </p>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.45em] text-white/60">— Eric Cantona</p>
            <Link
              to="/exhibitions"
              className="mt-12 inline-flex items-center gap-3 rounded-full border border-white/35 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-white backdrop-blur-md hover:bg-white hover:text-black transition-colors"
            >
              Explore Exhibitions <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 5. Founder — mask reveal portrait (Clean White Monochrome)          */
/* ------------------------------------------------------------------ */

const Founder = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const reveal = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const clip = useTransform(reveal, (v) => `inset(${v}% 0% 0% 0%)`);
  const sigX = useTransform(scrollYProgress, [0, 1], ["20%", "-30%"]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden bg-white px-6 py-32 md:px-16 md:py-48 text-black border-t border-black/10">
      <motion.div
        style={{ x: sigX }}
        className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap font-serif italic text-[22vw] leading-none text-black/[0.04]"
      >
        Ian Albertyn Ian Albertyn
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <motion.div style={{ clipPath: clip }} className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-2xl bg-zinc-100">
            <motion.img
              src="/images/ian-portrait-new.jpeg"
              alt="Ian Art Albertyn"
              style={{ y: imgY, scale: 1.2 }}
              className="h-full w-full object-cover grayscale"
            />
          </motion.div>
          <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.35em] text-black/50">
            <span>Ian Art Albertyn</span>
            <span>Founder &amp; Artist</span>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-10">
          <Eyebrow className="mb-8">The Artist</Eyebrow>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: EASE }}
            className="font-display text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter"
          >
            A visionary <br />
            <span className="font-serif font-normal italic normal-case text-black/60">from Cape Town</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
            className="mt-10 max-w-xl space-y-6 text-base md:text-lg leading-relaxed text-black/70"
          >
            <p>
              Born on 5 February 1982, Ian has always known art as his true calling — a way to express emotion, faith and belief. Raised in a Christian
              home, his work carries compassion and positivity at its core.
            </p>
            <p>
              Using wooden blocks, he builds art that symbolises <em className="font-serif text-xl text-black">building dreams block by block</em> — lending a
              hand to those in need and raising awareness for causes that matter.
            </p>
          </motion.div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Magnetic>
              <Link
                to="/contact"
                className="group inline-flex items-center gap-4 rounded-full bg-black px-9 py-5 text-[11px] font-extrabold uppercase tracking-[0.3em] text-white"
              >
                Commission a piece
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={14} />
                </span>
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 rounded-full border border-black/20 px-8 py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-black hover:border-black transition-colors"
              >
                Full Biography <ArrowUpRight size={14} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 6. Stats — counters                                                 */
/* ------------------------------------------------------------------ */

const Counter = ({ to, suffix = "+" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 2000;
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / dur);
      const e = 1 - Math.pow(2, -10 * k);
      setV(Math.floor(e * to));
      if (k < 1) raf = requestAnimationFrame(tick);
      else setV(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString()}
      {suffix}
    </span>
  );
};

const STATS = [
  { to: 1000000, label: "Blocks placed by hand" },
  { to: 10000, label: "Hours of creation" },
  { to: 250, label: "Artworks completed" },
  { to: 100, label: "Collectors & clients" },
];

const Stats = () => (
  <section className="relative bg-white px-6 py-28 md:px-16 md:py-40 text-black border-t border-black/10">
    <div className="mx-auto max-w-7xl">
      <Eyebrow className="mb-16">By the numbers</Eyebrow>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-black/10">
        {STATS.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, ease: EASE, delay: i * 0.1 }}
            className="group relative border-b border-black/10 py-10 pr-6 lg:border-b-0 lg:border-r last:border-r-0 lg:pl-6 first:lg:pl-0"
          >
            <span className="absolute left-0 top-0 h-px w-0 bg-black transition-all duration-700 group-hover:w-full" />
            <div className="font-display text-4xl md:text-5xl xl:text-6xl font-black tracking-tighter text-black">
              <Counter to={s.to} />
            </div>
            <p className="mt-3 font-serif italic text-xl text-black/55">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* 7. Faces — BLACK background ("Every block tells a story")           */
/* ------------------------------------------------------------------ */

const FACES = [
  "/faces/WhatsApp-Image-2023-08-01-at-22.10.53-2.jpeg",
  "/faces/WhatsApp-Image-2023-08-01-at-22.12.40.jpeg",
  "/faces/WhatsApp-Image-2023-08-01-at-22.18.17-1-1152x1536.jpeg",
  "/faces/WhatsApp-Image-2023-08-01-at-22.22.13.jpeg",
  "/faces/WhatsApp-Image-2023-08-08-at-21.27.34-3-1152x1536.jpeg",
  "/faces/WhatsApp-Image-2023-08-08-at-21.31.53-2-1152x1536.jpeg",
  "/faces/WhatsApp-Image-2023-08-08-at-21.31.54.jpeg",
  "/faces/WhatsApp-Image-2023-08-08-at-21.32.45-1152x1536.jpeg",
  "/faces/WhatsApp-Image-2023-08-08-at-21.33.24-1-1152x1536.jpeg",
  "/faces/WhatsApp-Image-2023-08-08-at-21.36.27-1152x1536.jpeg",
  "/faces/WhatsApp-Image-2023-08-29-at-20.44.42-1024x1024.jpeg",
  "/faces/WhatsApp-Image-2023-08-29-at-20.44.43-2-1024x1024.jpeg",
];

const Column = ({ imgs, y, className = "" }: { imgs: string[]; y: MotionValue<number>; className?: string }) => (
  <motion.div style={{ y }} className={`flex flex-col gap-5 md:gap-7 ${className}`}>
    {imgs.map((src, i) => (
      <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900">
        <img
          src={src}
          alt="IAN ART portrait"
          loading="lazy"
          className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
        />
      </div>
    ))}
  </motion.div>
);

const Faces = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -380]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-240, 220]);
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -520]);
  const y4 = useTransform(scrollYProgress, [0, 1], [-120, 300]);
  const titleScale = useTransform(scrollYProgress, [0.2, 0.6], [0.85, 1.05]);

  return (
    <section ref={ref} className="relative h-[170vh] overflow-hidden bg-black text-white">
      <div className="absolute inset-0 grid grid-cols-2 gap-5 px-4 md:grid-cols-4 md:gap-7 md:px-10 opacity-80">
        <Column imgs={FACES.slice(0, 3)} y={y1} />
        <Column imgs={FACES.slice(3, 6)} y={y2} className="pt-40" />
        <Column imgs={FACES.slice(6, 9)} y={y3} className="hidden md:flex" />
        <Column imgs={FACES.slice(9, 12)} y={y4} className="hidden md:flex pt-24" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.92)_20%,rgba(0,0,0,0.3)_72%)]" />
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div style={{ scale: titleScale }} className="relative z-10 px-6 text-center">
          <Eyebrow light className="justify-center mb-6">The Faces</Eyebrow>
          <h2 className="font-display text-6xl md:text-[9vw] font-black uppercase leading-[0.85] tracking-tighter text-white">
            Every block
            <br />
            <span className="font-serif font-normal italic normal-case text-white/65">tells a story</span>
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 8. Final CTA                                                        */
/* ------------------------------------------------------------------ */

const FinalCTA = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "0%"]);
  const spacing = useTransform(scrollYProgress, [0, 1], ["0.2em", "-0.04em"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-white px-6 pb-24 pt-40 md:px-16 text-black">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/15 to-transparent" />
      <motion.div style={{ y }} className="mx-auto max-w-7xl text-center">
        <Eyebrow className="justify-center mb-10">Let's build together</Eyebrow>
        <motion.h2
          style={{ letterSpacing: spacing }}
          className="font-display text-[16vw] md:text-[12vw] font-black uppercase leading-[0.82] text-black"
        >
          Your story,
        </motion.h2>
        <h2 className="font-serif italic text-[14vw] md:text-[10vw] leading-[0.9] text-black/60">
          block by block.
        </h2>

        <div className="mt-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Magnetic strength={0.5}>
            <Link
              to="/contact"
              className="group relative flex h-44 w-44 md:h-52 md:w-52 items-center justify-center overflow-hidden rounded-full bg-black text-[11px] font-extrabold uppercase tracking-[0.3em] text-white shadow-2xl"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-white transition-transform duration-700 ease-out group-hover:scale-100" />
              <span className="relative flex flex-col items-center gap-2 transition-colors duration-500 group-hover:text-black">
                Start a
                <br />
                commission
                <ArrowUpRight size={20} className="transition-transform duration-500 group-hover:rotate-45" />
              </span>
            </Link>
          </Magnetic>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 border-t border-black/10 pt-10 text-left md:grid-cols-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">Studio</p>
            <p className="mt-2 text-black/75">Unit 2, 15 Muscat Road, Saxenburg Park 1, Blackheath</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">Email</p>
            <a href="mailto:info@ianart.co.za" className="mt-2 block font-serif italic text-2xl text-black/80 hover:text-black">
              info@ianart.co.za
            </a>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/40">Phone</p>
            <a href="tel:0838008834" className="mt-2 block font-serif italic text-2xl text-black/80 hover:text-black">
              083 800 8834
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export const Home2 = () => (
  <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
    <ProgressRail />
    <Hero />
    <section className="relative -mt-px border-y border-black/10 bg-white py-10">
      <VelocityMarquee items={["Mosaic", "Portraiture", "Heritage", "Installations"]} baseVelocity={-2} />
      <VelocityMarquee items={["Block by block", "Hand placed", "Cape Town", "Since 1982"]} baseVelocity={2} outline />
    </section>
    <Manifesto />
    <HorizontalGallery />
    <Portal />
    <Founder />
    <Stats />
    <Faces />
    <FinalCTA />
  </main>
);

export default Home2;
