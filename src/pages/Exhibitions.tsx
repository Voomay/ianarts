import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { MapPin, ChevronLeft, ChevronRight, Maximize2, X, ArrowUpRight } from "lucide-react";
import { EXHIBITIONS_DATA } from "../data/exhibitionsData";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

export const Exhibitions: React.FC = () => {
  const [lightboxState, setLightboxState] = useState<{
    exhibitionIndex: number;
    imageIndex: number;
  } | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const imgScale = useTransform(p, [0, 1], [1.12, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-35%"]);

  const currentExhibitionForLightbox =
    lightboxState !== null ? EXHIBITIONS_DATA[lightboxState.exhibitionIndex] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxState === null || !currentExhibitionForLightbox) return;
      if (e.key === "Escape") setLightboxState(null);
      if (e.key === "ArrowRight") {
        setLightboxState((prev) =>
          prev !== null
            ? { ...prev, imageIndex: (prev.imageIndex + 1) % currentExhibitionForLightbox.images.length }
            : null
        );
      }
      if (e.key === "ArrowLeft") {
        setLightboxState((prev) =>
          prev !== null
            ? {
                ...prev,
                imageIndex:
                  (prev.imageIndex - 1 + currentExhibitionForLightbox.images.length) %
                  currentExhibitionForLightbox.images.length,
              }
            : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxState, currentExhibitionForLightbox]);

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
      <ProgressRail />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[440px] md:h-[82vh] md:min-h-[580px] bg-black text-white overflow-hidden flex items-center justify-center">
        <motion.img
          src="/images/exhibition-panorama.jpg"
          alt="Exhibitions"
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
        <motion.div style={{ y: titleY }} className="relative z-10 px-6 text-center max-w-6xl">
          <Eyebrow light className="justify-center mb-6">Gallery Showcases</Eyebrow>
          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-[11.5vw] sm:text-7xl md:text-[8.5vw]">
            <SplitReveal text="EXHIBITIONS" delay={0.15} stagger={0.035} />
          </h1>
          <p className="mt-4 font-serif italic text-3xl sm:text-5xl md:text-6xl text-white/75">
            public works &amp; solo shows
          </p>
        </motion.div>
        <Grain />
      </section>

      {/* 2. Marquee */}
      <section className="border-y border-black/10 bg-white py-8">
        <VelocityMarquee items={["Cape Town", "Solo Shows", "The New African", "Public Works"]} baseVelocity={-2} />
      </section>

      {/* 3. Exhibitions Timeline (White) */}
      <section className="bg-white px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-7xl space-y-28">
          {EXHIBITIONS_DATA.map((exh, exhIdx) => (
            <motion.article
              key={exh.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="border-t border-black/10 pt-14 space-y-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">
                    <span>{String(exhIdx + 1).padStart(2, "0")}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} /> {exh.venue}
                    </span>
                    <span>·</span>
                    <span>{exh.year}</span>
                  </div>
                  <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
                    {exh.title}
                  </h2>
                </div>
                <p className="lg:col-span-5 text-sm md:text-base leading-relaxed text-black/65">
                  {exh.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {exh.images.map((imgUrl, imgIdx) => (
                  <div
                    key={imgIdx}
                    onClick={() => setLightboxState({ exhibitionIndex: exhIdx, imageIndex: imgIdx })}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[20px] bg-zinc-100 cursor-pointer shadow-md"
                  >
                    <img
                      src={imgUrl}
                      alt={`${exh.title} ${imgIdx + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                    <div className="absolute right-4 top-4 flex h-10 w-10 scale-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-100 shadow-lg">
                      <Maximize2 size={15} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* 4. Black CTA */}
      <section className="bg-black text-white px-6 py-28 md:px-16 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <Eyebrow light className="justify-center">Curatorial Inquiries</Eyebrow>
          <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
            Walk the{" "}
            <span className="font-serif font-normal italic normal-case text-white/60">virtual gallery</span>
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Experience the collection in interactive 3D or reach out to host a future exhibition.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link
                to="/virtual-gallery"
                className="inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-black hover:bg-zinc-200 transition-colors"
              >
                3D Virtual Gallery <ArrowUpRight size={15} />
              </Link>
            </Magnetic>
            <Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full border border-white/30 px-9 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-white hover:bg-white hover:text-black transition-colors"
              >
                Book a Show <ArrowUpRight size={15} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxState !== null && currentExhibitionForLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-10"
          >
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <h4 className="font-display text-lg md:text-xl font-bold uppercase tracking-wider">
                  {currentExhibitionForLightbox.title}
                </h4>
                <p className="font-serif italic text-sm text-white/60">
                  {lightboxState.imageIndex + 1} / {currentExhibitionForLightbox.images.length}
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
                            (prev.imageIndex - 1 + currentExhibitionForLightbox.images.length) %
                            currentExhibitionForLightbox.images.length,
                        }
                      : null
                  )
                }
                className="absolute left-2 md:left-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>

              <img
                src={currentExhibitionForLightbox.images[lightboxState.imageIndex]}
                alt={currentExhibitionForLightbox.title}
                className="max-h-[78vh] max-w-[85vw] object-contain rounded-lg"
              />

              <button
                onClick={() =>
                  setLightboxState((prev) =>
                    prev
                      ? { ...prev, imageIndex: (prev.imageIndex + 1) % currentExhibitionForLightbox.images.length }
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

export default Exhibitions;
