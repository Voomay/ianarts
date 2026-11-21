import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight, Maximize2, X, QrCode, ChevronDown } from "lucide-react";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

const QR_ART_ITEMS = [
  {
    id: "qr-coffee",
    title: "Coffee Shop & Roastery",
    category: "Hospitality & Retail",
    subtitle: "Interactive Digital Menu & Roastery Story",
    image: "/images/qr/coffee.jpg",
    dimensions: "65cm × 65cm",
    blocks: "1,089 Handcrafted Blocks",
    description:
      "Commissioned for an artisanal espresso bar. Guests scan the tactile woodblock artwork mounted behind the counter to explore single-origin roasts, tasting notes, and mobile ordering.",
  },
  {
    id: "qr-restaurant",
    title: "Fine Dining Restaurant",
    category: "Gastronomy & Wine",
    subtitle: "Sommelier Wine Vault & Chef's Tasting",
    image: "/images/qr/restaurant.jpg",
    dimensions: "80cm × 80cm",
    blocks: "1,600 Milled Blocks",
    description:
      "Centerpiece installation in the main dining hall. Deep textured blocks create architectural shadow play while remaining 100% scannable for wine pairings and chef stories.",
  },
  {
    id: "qr-hotel",
    title: "Boutique Hotel Foyer",
    category: "Luxury Hospitality",
    subtitle: "24/7 VIP Concierge & Heritage Guide",
    image: "/images/qr/hotel.jpg",
    dimensions: "100cm × 100cm",
    blocks: "2,500 Geometric Woodblocks",
    description:
      "A 1-meter entrance statement. Arriving guests scan the artwork to unlock Wi-Fi, in-room dining menus, spa reservations, and private collection audio tours.",
  },
  {
    id: "qr-office",
    title: "Architecture Studio",
    category: "Corporate & Creative",
    subtitle: "Studio Portfolio & Direct Contact Hub",
    image: "/images/qr/office.jpg",
    dimensions: "75cm × 75cm",
    blocks: "1,296 Modular Blocks",
    description:
      "Positioned in the client reception lounge — both a sculptural conversation piece and an instant gateway for prospective clients to browse monographs and exchange digital cards.",
  },
  {
    id: "qr-retail",
    title: "Luxury Flagship Boutique",
    category: "Fashion & Retail",
    subtitle: "Exclusive Lookbook & Runway Archives",
    image: "/images/qr/retail.jpg",
    dimensions: "90cm × 90cm",
    blocks: "2,025 Artisan Blocks",
    description:
      "Custom wall piece connecting physical shoppers directly with limited-edition drops, behind-the-scenes artisan videos, and digital lookbooks.",
  },
];

const QR_FAQS = [
  {
    q: "Do the wooden blocks actually scan reliably with any smartphone?",
    a: "Yes. Every QR Art piece is engineered to strict ISO optical contrast standards so standard iOS and Android cameras scan it instantaneously from across the room.",
  },
  {
    q: "Can the destination link be updated later without changing the artwork?",
    a: "Yes. We route your physical mosaic through a dynamic link so you can update menus, portfolios, or campaigns anytime without altering a single block.",
  },
  {
    q: "What sizes are available for bespoke QR commissions?",
    a: "Standard commissions range from 65cm × 65cm up to monumental 2-meter architectural focal walls.",
  },
];

export const QRArt: React.FC = () => {
  const [lightboxItem, setLightboxItem] = useState<(typeof QR_ART_ITEMS)[number] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const imgScale = useTransform(p, [0, 1], [1.12, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-35%"]);

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
      <ProgressRail />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[440px] md:h-[82vh] md:min-h-[580px] bg-black text-white overflow-hidden flex items-center justify-center">
        <motion.img
          src="/images/qr/hero-wall.jpg"
          alt="Interactive QR Art"
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
        <motion.div style={{ y: titleY }} className="relative z-10 px-6 text-center max-w-6xl">
          <Eyebrow light className="justify-center mb-6">Physical Meets Digital</Eyebrow>
          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-6xl sm:text-8xl md:text-[9vw]">
            <SplitReveal text="QR ART" delay={0.15} stagger={0.05} />
          </h1>
          <p className="mt-4 font-serif italic text-3xl sm:text-5xl md:text-6xl text-white/75">
            scannable sculptures in wood
          </p>
        </motion.div>
        <Grain />
      </section>

      {/* 2. Marquee */}
      <section className="border-y border-black/10 bg-white py-8">
        <VelocityMarquee items={["Scannable", "Hand-Placed", "Dynamic Links", "Architectural"]} baseVelocity={-2} />
      </section>

      {/* 3. Showcase Grid (White) */}
      <section className="bg-white px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="pb-12 border-b border-black/10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Eyebrow className="mb-4">Interactive Works</Eyebrow>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter">
                Art that <span className="font-serif font-normal italic normal-case text-black/55">connects</span>
              </h2>
            </div>
            <p className="text-sm text-black/60 max-w-md">
              Each mosaic is hand-built to function as a working optical portal — linking physical spaces to menus, stories, Wi-Fi, or digital collections.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {QR_ART_ITEMS.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.85, ease: EASE, delay: (idx % 3) * 0.08 }}
                onClick={() => setLightboxItem(item)}
                className="group cursor-pointer flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden rounded-[22px] bg-zinc-100 shadow-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md">
                    {item.category}
                  </div>
                  <div className="absolute right-4 top-4 flex h-10 w-10 scale-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-100 shadow-lg">
                    <Maximize2 size={15} />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-black/45">
                    <span>{item.dimensions}</span>
                    <span>{item.blocks}</span>
                  </div>
                  <h3 className="font-display text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                  <p className="font-serif italic text-lg text-black/60">{item.subtitle}</p>
                  <p className="text-sm text-black/65 leading-relaxed pt-1">{item.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Black FAQ + CTA Section */}
      <section className="bg-black text-white px-6 py-28 md:px-16 md:py-36">
        <div className="mx-auto max-w-5xl">
          <Eyebrow light className="mb-6">Details</Eyebrow>
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">
            How QR Art <span className="font-serif font-normal italic normal-case text-white/60">works</span>
          </h2>

          <div className="divide-y divide-white/15 border-y border-white/15 mb-16">
            {QR_FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="py-6">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between text-left gap-6 cursor-pointer"
                  >
                    <span className="font-display text-lg md:text-2xl font-bold">{f.q}</span>
                    <ChevronDown size={20} className={`shrink-0 text-white/60 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pt-4 text-sm md:text-base text-white/65 leading-relaxed"
                      >
                        {f.a}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-4">
              <QrCode className="w-10 h-10 text-white/70" strokeWidth={1.3} />
              <p className="font-serif italic text-2xl text-white/80">Ready to commission a scannable piece?</p>
            </div>
            <Magnetic>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 rounded-full bg-white px-9 py-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-black hover:bg-zinc-200 transition-colors"
              >
                Commission QR Art <ArrowUpRight size={15} />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-10 cursor-pointer"
          >
            <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
              <div>
                <h4 className="font-display text-xl font-bold uppercase">{lightboxItem.title}</h4>
                <p className="font-serif italic text-sm text-white/60">{lightboxItem.subtitle}</p>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center py-6">
              <img src={lightboxItem.image} alt={lightboxItem.title} className="max-h-[78vh] max-w-full object-contain rounded-lg" />
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-white/40">Click anywhere to close</p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default QRArt;
