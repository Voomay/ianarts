import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Heart, ArrowUpRight } from "lucide-react";

export const DonateButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const expandTimer = setTimeout(() => setIsExpanded(true), 1800);
    const collapseTimer = setTimeout(() => setIsExpanded(false), 6500);

    const repeatInterval = setInterval(() => {
      setIsExpanded(true);
      setTimeout(() => setIsExpanded(false), 5000);
    }, 28000);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(collapseTimer);
      clearInterval(repeatInterval);
    };
  }, []);

  const showText = isExpanded || isHovered;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-5 md:right-5 z-[80] flex flex-col items-end pointer-events-auto max-w-[calc(100vw-2rem)]">
      <motion.a
        href="https://www.childrenshospitaltrust.org.za/donate/"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 18, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.96 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center p-1.5 pr-2 bg-black/92 backdrop-blur-xl border border-white/25 hover:border-white rounded-full shadow-[0_14px_35px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-pointer overflow-hidden"
        aria-label="Donate to Red Cross Children's Hospital"
      >
        <div className="relative flex items-center z-10">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-105 shrink-0">
            <Heart className="w-4 h-4 fill-black text-black" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white border border-black" />
            </span>
          </div>

          <motion.div
            initial={false}
            animate={{
              width: showText ? "auto" : 0,
              opacity: showText ? 1 : 0,
              marginLeft: showText ? 12 : 0,
              marginRight: showText ? 10 : 0,
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden flex flex-col text-left whitespace-nowrap"
          >
            <span className="text-[10px] font-display font-bold tracking-[0.2em] text-white uppercase flex items-center gap-1.5">
              Donate · Children&apos;s Hospital
              <ArrowUpRight className="w-3 h-3 text-white/70" />
            </span>
            <span className="text-[11px] font-serif italic text-white/65 leading-tight">
              Red Cross War Memorial Trust
            </span>
          </motion.div>
        </div>
      </motion.a>
    </div>
  );
};
