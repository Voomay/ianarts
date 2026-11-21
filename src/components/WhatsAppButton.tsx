import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-[4.5rem] right-4 md:bottom-20 md:right-5 z-[80] flex flex-col items-end pointer-events-auto max-w-[calc(100vw-2rem)]">
      <motion.a
        href="https://wa.me/27838008834?text=Hi%20Ian%20Art%2C%20I%20would%20like%20to%20inquire%20about%20your%20artworks%20and%20commissions."
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 18, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center p-1.5 pr-2 bg-black/92 backdrop-blur-xl border border-white/25 hover:border-white rounded-full shadow-[0_14px_35px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer overflow-hidden"
        aria-label="Chat on WhatsApp with Ian Art"
      >
        <div className="relative flex items-center z-10">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-105 shrink-0">
            <svg
              viewBox="0 0 24 24"
              width="17"
              height="17"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-black"
            >
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black border border-white" />
            </span>
          </div>

          <motion.div
            initial={false}
            animate={{
              width: isHovered ? "auto" : 0,
              opacity: isHovered ? 1 : 0,
              marginLeft: isHovered ? 12 : 0,
              marginRight: isHovered ? 10 : 0,
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden flex flex-col text-left whitespace-nowrap"
          >
            <span className="text-[10px] font-display font-bold tracking-[0.2em] text-white uppercase flex items-center gap-1.5">
              WhatsApp Studio
              <ArrowUpRight className="w-3 h-3 text-white/70" />
            </span>
            <span className="text-[11px] font-serif italic text-white/65 leading-tight">
              +27 83 800 8834 · Direct
            </span>
          </motion.div>
        </div>
      </motion.a>
    </div>
  );
};
