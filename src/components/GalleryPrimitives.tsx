import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValue,
  useAnimationFrame,
} from "motion/react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export const Grain = () => (
  <div className="pointer-events-none absolute inset-0 z-[60] opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
);

export const Eyebrow = ({
  children,
  className = "",
  light = false,
}: {
  children: React.ReactNode;
  className?: string;
  light?: boolean;
}) => (
  <p
    className={`flex items-center gap-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.45em] ${
      light ? "text-white/60" : "text-black/55"
    } ${className}`}
  >
    <span className={`inline-block h-px w-8 ${light ? "bg-white/60" : "bg-black/55"}`} />
    {children}
  </p>
);

export const SplitReveal = ({
  text,
  className = "",
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) => (
  <span className={`inline-flex overflow-hidden ${className}`} aria-label={text}>
    {text.split("").map((ch, i) => (
      <motion.span
        key={i}
        aria-hidden
        className="inline-block will-change-transform"
        initial={{ y: "110%", rotate: 8 }}
        animate={{ y: "0%", rotate: 0 }}
        transition={{ duration: 1.1, ease: EASE, delay: delay + i * stagger }}
      >
        {ch === " " ? "\u00A0" : ch}
      </motion.span>
    ))}
  </span>
);

export const Magnetic = ({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 15 });
  const y = useSpring(0, { stiffness: 200, damping: 15 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

export const VelocityMarquee = ({
  items,
  baseVelocity = -3,
  outline = false,
  dark = false,
}: {
  items: string[];
  baseVelocity?: number;
  outline?: boolean;
  dark?: boolean;
}) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothV = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smoothV, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(smoothV, [-2000, 2000], [-8, 8]);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = dir.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    baseX.set(baseX.get() + move);
  });

  const strokeColor = dark ? "#ffffff" : "#000000";
  const fillColor = dark ? "#ffffff" : "#000000";

  const row = (
    <span className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <span key={i} className="flex items-center">
          <span
            className={`px-4 sm:px-6 md:px-10 font-display font-black uppercase tracking-tighter text-4xl sm:text-6xl md:text-[8.5rem] leading-none ${
              outline ? "text-transparent" : ""
            }`}
            style={outline ? { WebkitTextStroke: `1.5px ${strokeColor}` } : { color: fillColor }}
          >
            {t}
          </span>
          <span
            className="font-serif italic text-3xl sm:text-5xl md:text-8xl"
            style={{ color: fillColor }}
          >
            ✦
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden whitespace-nowrap py-4">
      <motion.div style={{ x, skewX: skew }} className="flex">
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  );
};

export const ProgressRail = () => {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div className="fixed right-4 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 bg-black/15 mix-blend-difference md:block">
      <motion.div style={{ scaleY }} className="h-full w-px origin-top bg-white" />
    </div>
  );
};
