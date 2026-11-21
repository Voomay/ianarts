import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

export const About: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const hp = useSpring(heroP, { stiffness: 90, damping: 25 });
  const imgScale = useTransform(hp, [0, 1], [1.12, 1]);
  const titleY = useTransform(hp, [0, 1], ["0%", "-40%"]);
  const titleOpacity = useTransform(hp, [0, 0.7], [1, 0]);

  const portraitRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: portP } = useScroll({ target: portraitRef, offset: ["start end", "end start"] });
  const imgY = useTransform(portP, [0, 1], ["-8%", "8%"]);

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
      <ProgressRail />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[440px] md:h-[85vh] md:min-h-[600px] bg-black text-white overflow-hidden flex items-center justify-center">
        <motion.img
          src="/images/ian-portrait-new.jpeg"
          alt="Ian Art Albertyn"
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover object-top grayscale opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
        <motion.div style={{ y: titleY, opacity: titleOpacity }} className="relative z-10 px-6 text-center max-w-5xl">
          <Eyebrow light className="justify-center mb-6">The Artist · Cape Town</Eyebrow>
          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-[11.5vw] sm:text-7xl md:text-[9vw]">
            <SplitReveal text="IAN ALBERTYN" delay={0.15} stagger={0.04} />
          </h1>
          <p className="mt-4 font-serif italic text-2xl sm:text-4xl md:text-5xl text-white/75">
            visionary artistry, block by block
          </p>
        </motion.div>
        <Grain />
      </section>

      {/* 2. Marquee */}
      <section className="border-y border-black/10 bg-white py-8">
        <VelocityMarquee items={["Born 1982", "Cape Town", "Compassion", "Craftsmanship"]} baseVelocity={-2} />
      </section>

      {/* 3. Story Split */}
      <section ref={portraitRef} className="bg-white px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-zinc-100 shadow-2xl">
              <motion.img
                src="/images/ian-portrait-new.jpeg"
                alt="Ian Art Albertyn"
                style={{ y: imgY, scale: 1.16 }}
                className="h-full w-full object-cover grayscale"
              />
            </div>
            <div className="mt-4 flex justify-between text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">
              <span>Ian Art Albertyn</span>
              <span>Est. 1982</span>
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-10 space-y-8">
            <Eyebrow>Biography</Eyebrow>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter"
            >
              Building dreams <br />
              <span className="font-serif font-normal italic normal-case text-black/55">one block at a time</span>
            </motion.h2>

            <div className="space-y-6 text-base md:text-lg leading-relaxed text-black/70 max-w-2xl">
              <p>
                I am Ian Art Albertyn, a visionary artist from Cape Town, South Africa, born on February 5, 1982. Art has always been my true calling, allowing me to express emotion, faith, and human connection.
              </p>
              <p>
                Raised in a Christian home, I value compassion and positivity. My work draws inspiration from nature and people&apos;s diverse perspectives, reflecting both the beauty and complexity of our world.
              </p>
              <p>
                Through wooden blocks, I create tactile mosaics that symbolize building dreams block by block — lending a hand to those in need and raising awareness for causes such as the Red Cross War Memorial Children&apos;s Hospital.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Magnetic>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white hover:bg-zinc-800 transition-colors"
                >
                  Commission a Piece <ArrowUpRight size={15} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/virtual-gallery"
                  className="inline-flex items-center gap-3 rounded-full border border-black/20 px-8 py-4 text-[11px] font-bold uppercase tracking-[0.28em] text-black hover:border-black transition-colors"
                >
                  Enter 3D Gallery <ArrowUpRight size={15} />
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Black Philosophy Section */}
      <section className="bg-black text-white px-6 py-32 md:px-16 md:py-44">
        <div className="mx-auto max-w-5xl text-center space-y-10">
          <Eyebrow light className="justify-center">Philosophy</Eyebrow>
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="font-serif italic text-4xl sm:text-5xl md:text-7xl leading-[1.08] text-white"
          >
            “An artist is someone with the gift to light a dark room.”
          </motion.blockquote>
          <p className="text-[11px] font-bold uppercase tracking-[0.45em] text-white/45">— Eric Cantona</p>
        </div>
      </section>

      {/* 5. Three Pillars (White) */}
      <section className="bg-white text-black px-6 py-28 md:px-16">
        <div className="mx-auto max-w-7xl">
          <Eyebrow className="mb-14">The Craft</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-black/10">
            {[
              { no: "01", title: "Crafted by Hand", desc: "Every timber block is individually cut, finished, and placed by hand — up to tens of thousands per piece." },
              { no: "02", title: "Original Concepts", desc: "Bespoke portraits, heritage tributes, and interactive QR installations tailored to your space and story." },
              { no: "03", title: "Built to Last", desc: "Archival-grade materials and sculptural depth engineered to command architectural interiors for decades." },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: EASE }}
                className="py-12 md:px-8 first:md:pl-0 last:md:pr-0 border-b md:border-b-0 md:border-r last:border-r-0 border-black/10 space-y-4"
              >
                <span className="font-serif italic text-4xl text-black/40">{item.no}</span>
                <h3 className="font-display text-2xl font-black uppercase tracking-tight">{item.title}</h3>
                <p className="text-sm leading-relaxed text-black/65">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
