import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { db, collection, addDoc, serverTimestamp } from "../lib/firebase";
import {
  EASE,
  Grain,
  Eyebrow,
  SplitReveal,
  Magnetic,
  VelocityMarquee,
  ProgressRail,
} from "../components/GalleryPrimitives";

const FAQS = [
  {
    category: "Commissions",
    question: "How long does a custom wooden block piece take to complete?",
    answer:
      "Every block artwork is meticulously handcrafted. Custom commissions typically take between 2 to 6 weeks depending on size, complexity, and block count (ranging from thousands to over 100,000 blocks).",
  },
  {
    category: "Shipping",
    question: "Do you offer international shipping & white-glove delivery?",
    answer:
      "Yes, we ship globally. All artworks are securely crated in custom protective wooden boxes with museum-grade shock absorption and insured door-to-door courier service.",
  },
  {
    category: "Studio Visits",
    question: "Can I schedule a private viewing at the studio?",
    answer:
      "Private viewings at our Saxenburg Park studio in Blackheath are available by appointment Monday through Saturday. Fill out the form or call us to reserve a studio slot.",
  },
  {
    category: "QR Art",
    question: "How do the QR Code Art installations work?",
    answer:
      "Our QR Art pieces combine digital interactive connectivity with tangible physical block work. Scanning the scannable block mosaic triggers custom digital experiences, audio, or web interactions.",
  },
  {
    category: "Corporate",
    question: "What is the process for corporate & architectural installations?",
    answer:
      "We collaborate with interior architects, corporate galleries, and hotels — providing 3D digital renderings, palette sampling, structural mounting plans, and full site installation.",
  },
];

const INQUIRY_TYPES = [
  "Custom Art Commission",
  "Exhibition & Gallery",
  "Private Studio Visit",
  "Corporate & Architecture",
  "General Inquiry",
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: INQUIRY_TYPES[0],
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 25 });
  const imgScale = useTransform(p, [0, 1], [1.12, 1]);
  const titleY = useTransform(p, [0, 1], ["0%", "-35%"]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) return;
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const docRef = await addDoc(collection(db, "inquiries"), {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        inquiryType: formData.inquiryType,
        message: formData.message.trim(),
        status: "unread",
        createdAt: serverTimestamp(),
      });
      setSubmittedId(docRef.id);
      setFormData({ name: "", email: "", phone: "", inquiryType: INQUIRY_TYPES[0], message: "" });
    } catch (err) {
      console.error(err);
      setErrorMsg("Unable to send inquiry right now. Please email info@ianart.co.za directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white text-black selection:bg-black selection:text-white overflow-x-clip">
      <ProgressRail />

      {/* 1. Hero */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[440px] md:h-[80vh] md:min-h-[560px] bg-black text-white overflow-hidden flex items-center justify-center">
        <motion.img
          src="/images/hero-luxury-interior.jpg"
          alt="IAN ART Studio"
          style={{ scale: imgScale }}
          className="absolute inset-0 h-full w-full object-cover grayscale opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black" />
        <motion.div style={{ y: titleY }} className="relative z-10 px-6 text-center max-w-5xl">
          <Eyebrow light className="justify-center mb-6">Studio Inquiries</Eyebrow>
          <h1 className="font-display font-black uppercase leading-[0.85] tracking-tighter text-6xl sm:text-8xl md:text-[9vw]">
            <SplitReveal text="CONTACT" delay={0.15} stagger={0.04} />
          </h1>
          <p className="mt-4 font-serif italic text-3xl sm:text-5xl md:text-6xl text-white/75">
            start a conversation, block by block
          </p>
        </motion.div>
        <Grain />
      </section>

      {/* 2. Marquee */}
      <section className="border-y border-black/10 bg-white py-8">
        <VelocityMarquee items={["Commissions", "Studio Visits", "Exhibitions", "Cape Town"]} baseVelocity={-2} />
      </section>

      {/* 3. Main Form & Studio Details (White) */}
      <section className="bg-white px-6 py-24 md:px-16 md:py-32">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Info */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <Eyebrow className="mb-6">Direct Channels</Eyebrow>
              <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.92]">
                Let&apos;s build <br />
                <span className="font-serif font-normal italic normal-case text-black/55">something timeless</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-black/65 max-w-md">
                Whether you are commissioning a bespoke portrait, planning an architectural installation, or booking a private studio visit, we would love to hear from you.
              </p>
            </div>

            <div className="space-y-8 border-t border-black/10 pt-10">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-black/50 mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Studio HQ</p>
                  <p className="mt-1 text-base font-medium text-black">
                    Unit 2, 15 Muscat Road, Saxenburg Park 1, Blackheath, Cape Town
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-black/50 mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Email</p>
                  <a href="mailto:info@ianart.co.za" className="mt-1 block font-serif italic text-2xl text-black hover:opacity-65 transition-opacity">
                    info@ianart.co.za
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-black/50 mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Telephone &amp; WhatsApp</p>
                  <a href="tel:0838008834" className="mt-1 block font-serif italic text-2xl text-black hover:opacity-65 transition-opacity">
                    +27 83 800 8834
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-black/50 mt-1 shrink-0" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Viewing Hours</p>
                  <p className="mt-1 text-sm text-black/65">Mon – Sat · By Appointment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
              className="rounded-[28px] border border-black/15 bg-zinc-50/70 p-8 md:p-14"
            >
              {submittedId ? (
                <div className="py-16 text-center space-y-6">
                  <CheckCircle2 className="w-14 h-14 mx-auto text-black" strokeWidth={1.5} />
                  <h3 className="font-display text-3xl md:text-4xl font-black uppercase tracking-tight">
                    Inquiry Received
                  </h3>
                  <p className="text-black/65 text-sm max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your inquiry reference is <span className="font-mono text-black">{submittedId.slice(0, 8)}</span>. Our studio will respond shortly.
                  </p>
                  <button
                    onClick={() => setSubmittedId(null)}
                    className="rounded-full bg-black px-8 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-black/45 mb-4">Inquiry Type</p>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, inquiryType: type })}
                          className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] transition-all cursor-pointer ${
                            formData.inquiryType === type
                              ? "bg-black text-white"
                              : "border border-black/15 bg-white text-black/65 hover:border-black"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        className="w-full border-b border-black/20 bg-transparent py-3 text-base text-black placeholder:text-black/30 focus:border-black focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@example.com"
                        className="w-full border-b border-black/20 bg-transparent py-3 text-base text-black placeholder:text-black/30 focus:border-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 mb-2">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+27 ..."
                      className="w-full border-b border-black/20 bg-transparent py-3 text-base text-black placeholder:text-black/30 focus:border-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 mb-2">
                      Project Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your vision, dimensions, or timeline..."
                      className="w-full border-b border-black/20 bg-transparent py-3 text-base text-black placeholder:text-black/30 focus:border-black focus:outline-none resize-none"
                    />
                  </div>

                  {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

                  <Magnetic>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-3 rounded-full bg-black px-9 py-4 text-[11px] font-extrabold uppercase tracking-[0.28em] text-white hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <span>{isSubmitting ? "Sending..." : "Submit Inquiry"}</span>
                      <ArrowUpRight size={15} />
                    </button>
                  </Magnetic>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Black FAQ Section */}
      <section className="bg-black text-white px-6 py-28 md:px-16 md:py-36">
        <div className="mx-auto max-w-5xl">
          <Eyebrow light className="mb-6">Questions</Eyebrow>
          <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tighter mb-14">
            Frequently <span className="font-serif font-normal italic normal-case text-white/60">asked</span>
          </h2>

          <div className="divide-y divide-white/15 border-y border-white/15">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="py-6">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-6 cursor-pointer"
                  >
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-[0.35em] text-white/40 mb-1">
                        {faq.category}
                      </span>
                      <span className="font-display text-lg md:text-2xl font-bold tracking-tight text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-white/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-sm md:text-base leading-relaxed text-white/65 max-w-3xl">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
