import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight, Maximize2, X } from "lucide-react";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

const COMMISSIONED_WORKS = [
  { src: "/images/installations/general-installations-1.jpeg", title: "Luxury Residence", subtitle: "Private Estate Commission", year: "2024", category: "Private" },
  { src: "/images/installations/world-map-freedom36.png", title: "World Map Block Art", subtitle: "Freedom 36 Showcase", year: "2023", category: "Corporate" },
  { src: "/images/installations/blackbrick-imagination-1.jpeg", title: "Blackbrick Project", subtitle: "Architectural Work", year: "2022", category: "Corporate" },
  { src: "/images/installations/marc-lottering-1.jpeg", title: "Marc Lottering", subtitle: "Iconic Portrait Series", year: "2022", category: "Portraits" },
  { src: "/images/installations/general-installations-3.jpeg", title: "Cape Town Gallery", subtitle: "Private Collection", year: "2023", category: "Private" },
  { src: "/images/installations/robert-sobukwe-1.jpeg", title: "Robert Sobukwe", subtitle: "Heritage Tribute", year: "2023", category: "Portraits" },
  { src: "/images/installations/red-cross-1.jpeg", title: "Red Cross Trust", subtitle: "Philanthropic Installation", year: "2021", category: "Heritage" },
  { src: "/images/mandela-mosaic.jpg", title: "Madiba Mosaic", subtitle: "Signature Relief", year: "2019", category: "Heritage" },
];

const CATEGORIES = ["All", "Private", "Corporate", "Portraits", "Heritage"];

export const CommissionedWorks: React.FC = () => {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<(typeof COMMISSIONED_WORKS)[number] | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const imgScale = useTransform(p, [0, 1], [1.12, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-35%"]);

  const items = filter === "All" ? COMMISSIONED_WORKS : COMMISSIONED_WORKS.filter((w) => w.category === filter);

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
      <ProgressRail />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[440px] md:h-[82vh] md:min-h-[580px] bg-black text-white overflow-hidden flex items-center justify-center">
        <motion.img
          src="/images/installations/hero.jpg"
          alt="Commissioned Works"
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
        <motion.div style={{ y: titleY }} className="relative z-10 px-6 text-center max-w-6xl">
          <Eyebrow light className="justify-center mb-6">Bespoke Commissions</Eyebrow>
          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-[11vw] sm:text-7xl md:text-[8vw]">
            <SplitReveal text="COMMISSIONED" delay={0.15} stagger={0.035} />
          </h1>
          <p className="mt-4 font-serif italic text-3xl sm:text-5xl md:text-6xl text-white/75">
            works built for spaces
          </p>
        </motion.div>
        <Grain />
      </section>

      {/* 2. Marquee */}
      <section className="border-y border-black/10 bg-white py-8">
        <VelocityMarquee items={["Private Estates", "Corporate", "Portraiture", "Heritage"]} baseVelocity={-2} />
      </section>

      {/* 3. Filter & Gallery Grid (White) */}
      <section className="bg-white px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-12 border-b border-black/10">
            <div>
              <Eyebrow className="mb-4">Archive</Eyebrow>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Selected <span className="font-serif font-normal italic normal-case text-black/55">commissions</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all cursor-pointer ${
                    filter === cat
                      ? "bg-black text-white"
                      : "border border-black/15 text-black/65 hover:border-black hover:text-black"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((w, idx) => (
              <motion.article
                key={w.title}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.85, ease: EASE, delay: (idx % 3) * 0.08 }}
                onClick={() => setLightbox(w)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-zinc-100 shadow-lg">
                  <img
                    src={w.src}
                    alt={w.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute right-4 top-4 flex h-10 w-10 scale-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-100 shadow-lg">
                    <Maximize2 size={15} />
                  </div>
                </div>
                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <h3 className="font-display text-xl font-black uppercase tracking-tight">{w.title}</h3>
                    <p className="font-serif italic text-base text-black/55">{w.subtitle}</p>
                  </div>
                  <span className="font-display text-xs font-bold tracking-widest text-black/35">{w.year}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Black Process Section */}
      <section className="bg-black text-white px-6 py-28 md:px-16 md:py-36">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Eyebrow light>How a Commission Works</Eyebrow>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.92]">
              Let&apos;s create <br />
              <span className="font-serif font-normal italic normal-case text-white/60">something extraordinary.</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-lg">
              From initial concept and 3D spatial preview to hand-assembled timber relief and white-glove installation anywhere in the world.
            </p>
            <div className="pt-4">
              <Magnetic>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-black hover:bg-zinc-200 transition-colors"
                >
                  Start a Commission <ArrowUpRight size={15} />
                </Link>
              </Magnetic>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t lg:border-t-0 lg:border-l border-white/15 pt-10 lg:pt-0 lg:pl-12">
            {[
              { no: "01", title: "Concept", desc: "Share your space, dimensions, and story." },
              { no: "02", title: "Assembly", desc: "Thousands of blocks placed by hand in studio." },
              { no: "03", title: "Delivery", desc: "Museum-grade crating & global installation." },
            ].map((s) => (
              <div key={s.no} className="space-y-3">
                <span className="font-serif italic text-3xl text-white/40">{s.no}</span>
                <h3 className="font-display text-lg font-bold uppercase tracking-tight">{s.title}</h3>
                <p className="text-xs leading-relaxed text-white/55">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-10 cursor-pointer"
          >
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <h4 className="font-display text-xl font-bold uppercase tracking-wider">{lightbox.title}</h4>
                <p className="font-serif italic text-sm text-white/60">{lightbox.subtitle}</p>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center py-6">
              <motion.img
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                src={lightbox.src}
                alt={lightbox.title}
                className="max-h-[78vh] max-w-full object-contain rounded-lg"
              />
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-white/40">Click anywhere to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CommissionedWorks;
