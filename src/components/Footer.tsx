import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Youtube,
  ArrowUpRight,
  Check,
  Heart,
} from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3500);
      setEmail("");
    }
  };

  return (
    <footer className="relative z-20 w-full bg-black text-white border-t border-white/10 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16 pt-20 pb-12">
        {/* Top Editorial Band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10 items-end">
          <div className="lg:col-span-7 space-y-4">
            <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.45em] text-white/50">
              <span className="inline-block h-px w-8 bg-white/50" />
              Cape Town · London · Global
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] text-white">
              Every block{" "}
              <span className="font-serif font-normal italic normal-case text-white/60">
                tells a story.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/40 mb-3">
              Private Viewings &amp; Exhibitions
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex items-center border-b border-white/25 focus-within:border-white transition-colors pb-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Join the collector list — enter email"
                  required
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none pr-10 font-light"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 text-white hover:bg-white hover:text-black transition-all duration-300"
                >
                  {subscribed ? <Check size={14} /> : <ArrowUpRight size={15} />}
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-[11px] font-serif italic text-white/70">
                  Welcome to the studio list.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Middle 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 py-14 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <Link
              to="/"
              className="inline-flex items-baseline gap-0.5 font-display text-3xl font-black tracking-tighter text-white"
            >
              IAN ART<span className="text-white">.</span>
            </Link>
            <p className="text-sm text-white/55 font-light leading-relaxed max-w-xs">
              Fine architectural timber mosaics and bespoke sculptural portraiture by Ian Art Albertyn — building dreams, block by block.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {[
                { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
                { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
                { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/60 hover:border-white hover:text-black hover:bg-white transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45 mb-5">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-white/65 font-light">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Commissioned Works", to: "/commissioned-works" },
                { label: "Installations", to: "/installations" },
                { label: "Exhibitions", to: "/exhibitions" },
                { label: "Interactive QR Art", to: "/qr-art" },
                { label: "3D Virtual Gallery", to: "/virtual-gallery" },
                { label: "Contact", to: "/contact" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-flex items-center gap-1.5 hover:text-white hover:translate-x-1 transition-all duration-300"
                  >
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio */}
          <div className="lg:col-span-3">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45 mb-5">
              Studio HQ
            </h3>
            <ul className="space-y-3.5 text-sm text-white/65 font-light">
              <li className="leading-relaxed">
                Unit 2, 15 Muscat Road
                <br />
                Saxenburg Park 1, Blackheath
                <br />
                Cape Town, South Africa
              </li>
              <li>
                <a
                  href="mailto:info@ianart.co.za"
                  className="font-serif italic text-lg text-white hover:text-white/70 transition-colors"
                >
                  info@ianart.co.za
                </a>
              </li>
              <li>
                <a
                  href="tel:0838008834"
                  className="text-white/75 hover:text-white transition-colors tracking-wider"
                >
                  +27 83 800 8834
                </a>
              </li>
            </ul>
          </div>

          {/* Cause & Curator */}
          <div className="lg:col-span-2 flex flex-col justify-between gap-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/45 mb-5">
                Philanthropy
              </h3>
              <a
                href="https://www.childrenshospitaltrust.org.za/donate/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-start gap-2.5 text-xs text-white/65 hover:text-white transition-colors leading-relaxed"
              >
                <Heart size={14} className="text-white shrink-0 mt-0.5" />
                <span>Red Cross War Memorial Children&apos;s Hospital Trust</span>
              </a>
            </div>

            <Link
              to="/admin"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white/70 hover:border-white hover:bg-white hover:text-black transition-all"
            >
              Curator Backend
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© {new Date().getFullYear()} Ian Art Albertyn. All rights reserved.</p>
          <p className="font-serif italic text-sm text-white/60">
            Building dreams, block by block.
          </p>
        </div>
      </div>
    </footer>
  );
};
