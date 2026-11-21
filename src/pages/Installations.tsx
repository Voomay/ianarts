import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, X, MapPin, ArrowUpRight } from "lucide-react";
import { INSTALLATION_PROJECTS } from "../data/installationsData";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

const FILTER_CATEGORIES = [
  { id: "ALL", label: "All Installations" },
  { id: "featured-installations", label: "Featured" },
  { id: "freedom-36", label: "Freedom 36" },
  { id: "blackbrick-imagination", label: "Blackbrick" },
  { id: "marc-lottering", label: "Marc Lottering" },
  { id: "red-cross", label: "Red Cross" },
  { id: "robert-sobukwe", label: "Sobukwe & Kerzner" },
];

export const Installations: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [lightboxState, setLightboxState] = useState<{
    projectIndex: number;
    imageIndex: number;
  } | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const imgScale = useTransform(p, [0, 1], [1.12, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-35%"]);

  const filteredProjects = INSTALLATION_PROJECTS.filter((proj) =>
    activeFilter === "ALL" ? true : proj.id === activeFilter
  );

  const currentProjectForLightbox =
    lightboxState !== null ? INSTALLATION_PROJECTS[lightboxState.projectIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxState === null || !currentProjectForLightbox) return;
      if (e.key === "Escape") setLightboxState(null);
      if (e.key === "ArrowRight") {
        setLightboxState((prev) =>
          prev !== null
            ? { ...prev, imageIndex: (prev.imageIndex + 1) % currentProjectForLightbox.images.length }
            : null
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxState((prev) =>
          prev !== null
            ? {
                ...prev,
                imageIndex:
                  (prev.imageIndex - 1 + currentProjectForLightbox.images.length) %
                  currentProjectForLightbox.images.length,
              }
            : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxState, currentProjectForLightbox]);

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
      <ProgressRail />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[440px] md:h-[82vh] md:min-h-[580px] bg-black text-white overflow-hidden flex items-center justify-center">
        <motion.img
          src="/images/installations/hero.jpg"
          alt="Architectural Installations"
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
        <motion.div style={{ y: titleY }} className="relative z-10 px-6 text-center max-w-6xl">
          <Eyebrow light className="justify-center mb-6">Architectural Works</Eyebrow>
          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-[10.5vw] sm:text-7xl md:text-[8.5vw]">
            <SplitReveal text="INSTALLATIONS" delay={0.15} stagger={0.035} />
          </h1>
          <p className="mt-4 font-serif italic text-3xl sm:text-5xl md:text-6xl text-white/75">
            monumental relief in wood
          </p>
        </motion.div>
        <Grain />
      </section>

      {/* 2. Marquee */}
      <section className="border-y border-black/10 bg-white py-8">
        <VelocityMarquee items={["Freedom 36", "Blackbrick", "Red Cross", "Private Estates"]} baseVelocity={-2} />
      </section>

      {/* 3. Filter & Projects (White) */}
      <section className="bg-white px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-black/10">
            <div>
              <Eyebrow className="mb-4">Selected Spaces</Eyebrow>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Site-specific <span className="font-serif font-normal italic normal-case text-black/55">collections</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTER_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveFilter(cat.id)}
                  className={`rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-all cursor-pointer ${
                    activeFilter === cat.id
                      ? "bg-black text-white"
                      : "border border-black/15 text-black/65 hover:border-black hover:text-black"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-16 space-y-28">
            {filteredProjects.map((project) => {
              const origIndex = INSTALLATION_PROJECTS.findIndex((p) => p.id === project.id);
              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.9, ease: EASE }}
                  className="space-y-10"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                    <div className="lg:col-span-7 space-y-3">
                      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">
                        <MapPin size={12} /> {project.subtitle} · {project.category}
                      </p>
                      <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tighter">
                        {project.title}
                      </h3>
                    </div>
                    <p className="lg:col-span-5 text-sm md:text-base leading-relaxed text-black/65">
                      {project.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {project.images.slice(0, 8).map((imgUrl, imgIdx) => (
                      <div
                        key={imgIdx}
                        onClick={() => setLightboxState({ projectIndex: origIndex, imageIndex: imgIdx })}
                        className="group relative aspect-[4/5] overflow-hidden rounded-[18px] bg-zinc-100 cursor-pointer shadow-md"
                      >
                        <img
                          src={imgUrl}
                          alt={`${project.title} ${imgIdx + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute right-3 top-3 flex h-9 w-9 scale-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-100 shadow-lg">
                          <Maximize2 size={14} />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Black CTA Band */}
      <section className="bg-black text-white px-6 py-28 md:px-16 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <Eyebrow light className="justify-center">Architectural Commissions</Eyebrow>
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            Transform your{" "}
            <span className="font-serif font-normal italic normal-case text-white/60">space</span>
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Collaborate directly with Ian Art Albertyn on custom lobby, hotel, corporate, or private residence installations.
          </p>
          <div className="pt-2">
            <Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-black hover:bg-zinc-200 transition-colors"
              >
                Inquire Now <ArrowUpRight size={15} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxState !== null && currentProjectForLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-10"
          >
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <h4 className="font-display text-lg md:text-xl font-bold uppercase tracking-wider">
                  {currentProjectForLightbox.title}
                </h4>
                <p className="font-serif italic text-sm text-white/60">
                  {lightboxState.imageIndex + 1} / {currentProjectForLightbox.images.length}
                </p>
              </div>
              <button
                onClick={() => setLightboxState(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="relative flex-1 flex items-center justify-center py-6">
              <button
                onClick={() =>
                  setLightboxState((prev) =>
                    prev
                      ? {
                          ...prev,
                          imageIndex:
                            (prev.imageIndex - 1 + currentProjectForLightbox.images.length) %
                            currentProjectForLightbox.images.length,
                        }
                      : null
                  )
                }
                className="absolute left-2 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>

              <img
                src={currentProjectForLightbox.images[lightboxState.imageIndex]}
                alt={currentProjectForLightbox.title}
                className="max-h-[78vh] max-w-[85vw] object-contain rounded-lg"
              />

              <button
                onClick={() =>
                  setLightboxState((prev) =>
                    prev
                      ? { ...prev, imageIndex: (prev.imageIndex + 1) % currentProjectForLightbox.images.length }
                      : null
                  )
                }
                className="absolute right-2 md:right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Installations;
