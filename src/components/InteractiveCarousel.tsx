import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface InteractiveCarouselProps {
  artworks?: {
    id: number;
    title: string;
    category: string;
    image: string;
  }[];
}

const DEFAULT_ARTWORKS = [
  {
    id: 1,
    title: "Visions of Chaos",
    category: "Digital Expressionism",
    image: "/uploads/uploads/2023/08/WhatsApp-Image-2023-08-01-at-21.40.56.jpeg",
  },
  {
    id: 2,
    title: "Transcendence",
    category: "Abstract Narrative",
    image: "/uploads/uploads/2023/08/WhatsApp-Image-2023-08-29-at-20.44.42.jpeg",
  },
  {
    id: 3,
    title: "The Narrative",
    category: "Graphic Portraiture",
    image: "/uploads/uploads/2023/08/IanArt-Biography-.png",
  },
  {
    id: 4,
    title: "Fragmented Soul",
    category: "Mixed Media",
    image: "/uploads/uploads/2023/08/Snapinsta.app_332517770_716653546856776_5675833427327485169_n_1024.jpg",
  },
  {
    id: 5,
    title: "Monochrome Echo",
    category: "Minimalist Flow",
    image: "/uploads/uploads/2023/08/WhatsApp-Image-2023-08-01-at-21.26.03.jpeg",
  },
  {
    id: 6,
    title: "Silent Structures",
    category: "Architectural Art",
    image: "/uploads/uploads/2023/08/WhatsApp-Image-2023-08-01-at-21.38.18.jpeg",
  },
  {
    id: 7,
    title: "Organic Rhythm",
    category: "Fluid Dynamics",
    image: "/uploads/uploads/2023/08/WhatsApp-Image-2023-07-20-at-19.47.24-2.jpg",
  },
  {
    id: 8,
    title: "Digital Genesis",
    category: "Generative Form",
    image: "/uploads/uploads/2023/08/WhatsApp-Image-2023-08-01-at-21.55.02.jpeg",
  },
];

const getXPosition = (offset: number, baseWidth: number, gap: number, perspective: number = 1200) => {
  if (offset === 0) return 0;
  
  const absOffset = Math.abs(offset);
  let targetX = 0;
  
  // Calculate projected widths on screen
  const getProjectedWidth = (k: number) => {
    const scale = 0.76 + k * 0.12;
    const z = -150 + k * 70;
    const perspectiveFactor = perspective / (perspective - z);
    return baseWidth * scale * perspectiveFactor;
  };
  
  const w0_proj = getProjectedWidth(0);
  const w1_proj = getProjectedWidth(1);
  
  targetX += w0_proj / 2 + gap + w1_proj / 2;
  
  for (let i = 2; i <= absOffset; i++) {
    const wPrev_proj = getProjectedWidth(i - 1);
    const wCurr_proj = getProjectedWidth(i);
    targetX += wPrev_proj / 2 + gap + wCurr_proj / 2;
  }
  
  // Convert 2D target screen position back to 3D coordinate
  const zCurr = -150 + absOffset * 70;
  const currPerspectiveFactor = perspective / (perspective - zCurr);
  const x3D = targetX / currPerspectiveFactor;
  
  return offset > 0 ? x3D : -x3D;
};

export const InteractiveCarousel = ({ artworks = DEFAULT_ARTWORKS }: InteractiveCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(Math.floor(artworks.length / 2));
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [isManual, setIsManual] = useState(false);

  // Track previous activeIndex to identify when wrapping occurs
  const prevActiveIndexRef = useRef(activeIndex);
  useEffect(() => {
    prevActiveIndexRef.current = activeIndex;
  });
  const prevActiveIndex = prevActiveIndexRef.current;

  const manualTimeoutRef = useRef<any>(null);

  const triggerManualTransition = (newIndex: number) => {
    setIsManual(true);
    setActiveIndex(newIndex);
    
    if (manualTimeoutRef.current) {
      clearTimeout(manualTimeoutRef.current);
    }
    
    manualTimeoutRef.current = setTimeout(() => {
      setIsManual(false);
    }, 1500);
  };

  // Autoplay functionality - advances automatically and resets timer on interaction
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % artworks.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [activeIndex, artworks.length]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = (_event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      triggerManualTransition((activeIndex + 1) % artworks.length);
    } else if (info.offset.x > swipeThreshold) {
      triggerManualTransition((activeIndex - 1 + artworks.length) % artworks.length);
    }
  };

  const handleCardClick = (index: number) => {
    triggerManualTransition(index);
  };

  return (
    <section className="relative py-32 bg-black overflow-hidden border-t border-white/5 flex flex-col items-center">
      {/* Curved Perspective Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] bg-emerald-500/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] sm:w-[450px] h-[250px] bg-cyan-500/5 rounded-full blur-[80px] sm:blur-[110px] pointer-events-none" />

      {/* Grid line overlay matching portfolio style */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

      {/* Header section */}
      <div className="text-center max-w-4xl mx-auto px-6 mb-16 relative z-10 space-y-6">
        <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tighter text-gradient-reverse whitespace-nowrap">
          Commissioned works
        </h2>
        <p className="max-w-2xl mx-auto text-xs uppercase tracking-widest opacity-50 leading-loose">
          A curated selection of commissioned projects. Each piece represents a unique collaboration and artistic vision, tailored specifically to the space and the client's aspirations. These works blend structural minimalism with profound narrative depth, reflecting a careful balance between our signature style and the individual essence of every commission.
        </p>
      </div>

      {/* 3D Curved Slider */}
      <div className="relative w-full py-8 flex items-center justify-center" style={{ perspective: "1200px" }}>
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={handleDragEnd}
          className="relative flex items-center justify-center w-full h-[320px] sm:h-[450px] cursor-grab active:cursor-grabbing z-20"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Vertical neon green glow bar in the center */}
          <div 
            className="absolute w-[4px] sm:w-[5px] h-[260px] sm:h-[380px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.95),0_0_40px_rgba(16,185,129,0.7)] pointer-events-none rounded-full"
            style={{ 
              zIndex: 1, 
              transform: "translate3d(0, 0, -90px)" 
            }} 
          />

          {artworks.map((card, index) => {
            const count = artworks.length;
            let offset = index - activeIndex;

            // Circular wrapping
            if (offset < -count / 2) offset += count;
            if (offset > count / 2) offset -= count;

            // Compute previous offset to check if the card wraps
            let prevOffset = index - prevActiveIndex;
            if (prevOffset < -count / 2) prevOffset += count;
            if (prevOffset > count / 2) prevOffset -= count;

            const isCenter = offset === 0;
            const absOffset = Math.abs(offset);
            
            // Concave scale and position curve
            const scale = 0.76 + absOffset * 0.12;
            const zTranslate = -150 + absOffset * 70;
            const rotateYVal = offset * -18;
            
            // Outer cards fade out beautifully
            const cardOpacity = 1 - Math.min(absOffset * 0.25, 0.9);

            // Compute dynamic position to guarantee identical visual gaps between all adjacent cards
            const baseWidth = windowWidth < 640 ? 180 : windowWidth < 768 ? 260 : 290;
            const gap = windowWidth < 640 ? 20 : windowWidth < 768 ? 35 : 45;
            const xPos = getXPosition(offset, baseWidth, gap, 1200);

            // Prevent cards from jumping across center during wrapping by disabling transitions on wrap
            const isWrapped = Math.abs(offset - prevOffset) > 1.5;
            const transitionConfig = isWrapped
              ? { type: "tween", duration: 0 }
              : isManual
                ? { type: "spring", stiffness: 120, damping: 20 }
                : { type: "tween", ease: "easeInOut", duration: 4 };

            return (
              <motion.div
                key={index}
                onClick={() => handleCardClick(index)}
                animate={{
                  x: xPos,
                  scale: scale,
                  rotateY: rotateYVal,
                  z: zTranslate,
                  opacity: cardOpacity,
                }}
                transition={transitionConfig}
                className={`absolute w-[180px] sm:w-[260px] md:w-[290px] aspect-[3/4] rounded-2xl border ${
                  isCenter ? "border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.15)]" : "border-white/10"
                } overflow-hidden shadow-2xl bg-zinc-900 select-none group`}
                style={{
                  zIndex: Math.round(absOffset),
                  transformStyle: "preserve-3d",
                  pointerEvents: "auto",
                }}
              >
                {/* Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  draggable="false"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                {/* Cyberpunk grid overlay for active card */}
                {isCenter && (
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
                )}

                {/* Subtle outer glow on active card */}
                {isCenter && (
                  <div className="absolute inset-0 border border-emerald-500/40 rounded-2xl animate-pulse pointer-events-none" />
                )}

                {/* Card Title Overlay on Hover/Center */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-6 transition-all duration-500 ${
                  isCenter ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-emerald-400 font-bold mb-1">
                    {card.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-display font-black text-white uppercase tracking-wider">
                    {card.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Nav dots helper */}
      <div className="flex gap-2.5 mt-8 sm:mt-12 relative z-10">
        {artworks.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              activeIndex === i ? "w-10 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "w-1.5 bg-white/20 hover:bg-white/45"
            }`}
          />
        ))}
      </div>
    </section>
  );
};
