/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, AnimatePresence, useInView } from "motion/react";
import { ArrowLeft, ArrowRight, Instagram, Facebook, Linkedin, Menu, X, ArrowUpRight, Play, Sparkles, ChevronLeft, ChevronRight, Heart, ExternalLink, Boxes, Clock, Frame, Users, Box, LayoutGrid, ShieldCheck, Maximize2 } from "lucide-react";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { CustomCursor } from "./components/CustomCursor";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Page Imports
import { Exhibitions } from "./pages/Exhibitions";
import { Installations } from "./pages/Installations";
import { QRArt } from "./pages/QRArt";
import { VirtualGallery } from "./pages/VirtualGallery";
import { AdminDashboard } from "./pages/AdminDashboard";
import { Login } from "./pages/Login";
import { Contact } from "./pages/Contact";
import { Home2 } from "./pages/Home2";
import { About } from "./pages/About";
import { CommissionedWorks } from "./pages/CommissionedWorks";
import { DonateButton } from "./components/DonateButton";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { Footer } from "./components/Footer";
import { db, collection, addDoc, serverTimestamp } from "./lib/firebase";

const ARTWORKS = [
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
  ];

  const scrollLinks = [
    { name: "About", path: "/about" },
    { name: "Exhibitions", path: "/exhibitions" },
    { name: "Installations", path: "/installations" },
    { name: "QR Art", path: "/qr-art" },
    { name: "Commissioned Works", path: "/commissioned-works" },
    { name: "Contact", path: "/contact" },
  ];

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        when: "afterChildren"
      }
    },
    opened: {
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: 30, rotateX: 45 },
    opened: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      } 
    }
  };

  const renderLink = (link: any, isMobile: boolean = false) => {
    const isActive = 'path' in link && location.pathname === link.path;
    const className = isMobile 
      ? "text-2xl sm:text-3xl md:text-5xl font-display font-black uppercase tracking-tighter text-white hover:italic transition-all duration-300 block py-1"
      : `group relative py-1 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`;

    const underline = !isMobile && (
      <span
        className={`absolute bottom-0 left-0 h-px bg-white transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />
    );

    if ('path' in link) {
      return (
        <Link 
          key={link.path} 
          to={link.path} 
          onClick={() => setIsOpen(false)}
          className={className}
        >
          {link.name}
          {underline}
        </Link>
      );
    }

    const target = isHome ? `#${link.hash}` : `/#${link.hash}`;
    return (
      <a 
        key={link.hash} 
        href={target} 
        onClick={() => setIsOpen(false)}
        className={className}
      >
        {link.name}
        {underline}
      </a>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-12 flex justify-between items-center transition-all duration-500 ${
        isScrolled
          ? 'py-3.5 bg-black/88 backdrop-blur-xl border-b border-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.25)]'
          : 'py-6 md:py-8 bg-gradient-to-b from-black/70 via-black/30 to-transparent'
      }`}
    >
      <Link to="/" onClick={() => setIsOpen(false)} className="relative z-[60] flex items-center group">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl md:text-2xl font-display font-black tracking-tighter text-white"
        >
          IAN ART<span className="text-white">.</span>
        </motion.div>
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-[0.24em] font-semibold">
        {navLinks.map(link => renderLink(link))}
        {scrollLinks.map(link => renderLink(link))}
        
        {/* Gallery CTA Pill */}
        <Link 
          to="/virtual-gallery"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-full text-[10px] font-extrabold uppercase tracking-[0.25em] transition-all duration-300 shadow-lg hover:scale-[1.03] cursor-pointer ml-2"
        >
          <span>Gallery</span>
          <ArrowUpRight size={13} />
        </Link>

        {/* Donate Pill */}
        <a 
          href="https://www.childrenshospitaltrust.org.za/donate/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 border border-white/30 hover:border-white bg-black/60 hover:bg-white text-white hover:text-black rounded-full text-[10px] font-bold tracking-[0.25em] transition-all duration-300"
        >
          <Heart size={12} className="fill-current" />
          <span>Donate</span>
        </a>
      </div>

      {/* Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-[60] w-10 h-10 flex items-center justify-center lg:hidden group"
        aria-label="Toggle Menu"
      >
        <div className="flex flex-col gap-1.5 items-end">
          <motion.span 
            animate={{ 
              rotate: isOpen ? 45 : 0, 
              y: isOpen ? 7 : 0,
              width: isOpen ? 32 : 24
            }}
            className="h-0.5 bg-white block transition-colors group-hover:bg-white/70" 
          />
          <motion.span 
            animate={{ 
              opacity: isOpen ? 0 : 1,
              width: isOpen ? 0 : 32
            }}
            className="h-0.5 bg-white block transition-colors group-hover:bg-white/70" 
          />
          <motion.span 
            animate={{ 
              rotate: isOpen ? -45 : 0, 
              y: isOpen ? -7 : 0,
              width: isOpen ? 32 : 16
            }}
            className="h-0.5 bg-white block transition-colors group-hover:bg-white/70" 
          />
        </div>
      </button>

      {/* Mobile Menu Slide-out */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div 
            variants={menuVariants}
            initial="closed"
            animate="opened"
            exit="closed"
            className="fixed inset-0 bg-black z-50 flex flex-col p-6 md:p-10 pt-24 md:pt-32 h-[100dvh] w-screen overflow-y-auto"
          >
            {/* Mobile Virtual Gallery Quick Jump */}
            <motion.div variants={linkVariants} className="mb-4">
              <Link
                to="/virtual-gallery"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-4 bg-white text-black rounded-full font-display font-black text-base sm:text-xl uppercase tracking-tight shadow-xl px-6"
              >
                <span>3D Virtual Gallery</span>
                <ChevronRight size={18} />
              </Link>
            </motion.div>

            <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
              {[...navLinks, ...scrollLinks].map((link, idx) => (
                <motion.div key={idx} variants={linkVariants}>
                  {renderLink(link, true)}
                </motion.div>
              ))}
            </div>

            <motion.div 
              variants={linkVariants}
              className="mt-8 md:mt-auto flex flex-col gap-6 pb-10"
            >
              <a 
                href="https://www.childrenshospitaltrust.org.za/donate/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 px-6 rounded-full bg-white/5 border border-white/25 hover:bg-white hover:text-black text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart size={16} className="fill-current" />
                  <span>Donate to Children&apos;s Hospital</span>
                </div>
                <ExternalLink size={14} className="opacity-70" />
              </a>
              <div className="flex gap-8 text-white/40">
                <Facebook className="hover:text-white transition-colors cursor-pointer" size={24} />
                <Instagram className="hover:text-white transition-colors cursor-pointer" size={24} />
                <Linkedin className="hover:text-white transition-colors cursor-pointer" size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Location</p>
                <p className="text-sm uppercase tracking-widest text-white/60">Cape Town — London — Global</p>
              </div>
            </motion.div>

            {/* Subtle background text */}
            <div className="absolute bottom-0 right-0 opacity-[0.03] select-none pointer-events-none translate-y-1/4">
               <h2 className="text-[40vw] font-display font-black uppercase text-white leading-none">Art</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};


const ParticleText = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<any[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const init = () => {
      const container = containerRef.current;
      if (!container) return;
      width = canvas.width = container.clientWidth;
      height = canvas.height = container.clientHeight;

      ctx.clearRect(0, 0, width, height);
      const fontSize = Math.min(width * 0.25, 230);
      ctx.font = `900 ${fontSize}px "Inter", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.fillText("IAN ART", width / 2, height / 2);

      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      particles.current = [];

      const gap = 3;
      
      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 128) {
            particles.current.push({
              x: x,
              y: y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: gap - 1,
              color: `rgba(255, 255, 255, ${0.4 + Math.random() * 0.6})`,
              friction: 0.95,
              ease: 0.1,
            });
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.current.forEach((p) => {
        // Calculate distance to mouse
        const dx_m = mouse.current.x - p.x;
        const dy_m = mouse.current.y - p.y;
        const dist_m = Math.sqrt(dx_m * dx_m + dy_m * dy_m);
        const maxDist = 120;

        let targetX = p.originX;
        let targetY = p.originY;

        if (mouse.current.active && dist_m < maxDist) {
          const angle = Math.atan2(dy_m, dx_m);
          const force = (maxDist - dist_m) / maxDist;
          targetX = p.originX - Math.cos(angle) * force * 150;
          targetY = p.originY - Math.sin(angle) * force * 150;
        }

        const dx = targetX - p.x;
        const dy = targetY - p.y;
        
        p.vx += dx * p.ease;
        p.vy += dy * p.ease;
        p.vx *= p.friction;
        p.vy *= p.friction;

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
      mouse.current.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.current.x = e.touches[0].clientX - rect.left;
        mouse.current.y = e.touches[0].clientY - rect.top;
        mouse.current.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.current.active = false;
    };

    const handleTouchEnd = () => {
      mouse.current.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchstart", handleTouchMove, { passive: true });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);
    const handleResize = () => init();
    window.addEventListener("resize", handleResize);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchstart", handleTouchMove);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
    </div>
  );
};

const YeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const identityY = useTransform(scrollYProgress, [0, 0.5], [0, -80]);
  const brandingScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.85, 0]);

  return (
    <section id="home" ref={containerRef} className="relative min-h-screen h-[105vh] bg-black overflow-hidden flex items-center justify-center">
      {/* High Resolution Luxury Interior Showcase Background */}
      <motion.div 
        style={{ scale: imageScale, y: imageY }}
        className="absolute inset-0 w-full h-full"
      >
        <img 
          src="/images/hero-luxury-interior.jpg" 
          alt="IAN ART Luxury Interior Showcase"
          className="w-full h-full object-cover object-center"
        />
      </motion.div>

      {/* Layered Cinematic Overlays for Perfect Contrast & Mood */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/75 pointer-events-none z-[2]" />
      <div className="absolute inset-0 bg-black/25 pointer-events-none z-[3]" />

      {/* Foreground Hero Content */}
      <motion.div 
        style={{ opacity, y: identityY }}
        className="relative z-10 w-full max-w-6xl px-6 md:px-12 py-24 flex flex-col items-center text-center select-none"
      >
        {/* Main Branding Title */}
        <motion.div
          style={{ scale: brandingScale }}
          className="relative flex flex-col items-center"
        >
          <h1 className="text-6xl sm:text-8xl md:text-[14vw] font-display font-black tracking-tighter text-white leading-none drop-shadow-[0_10px_60px_rgba(0,0,0,0.8)] uppercase origin-center">
            IAN ART
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-3xl mt-4 md:mt-6"
        >
          <h2 className="text-xl sm:text-2xl md:text-5xl font-display font-black tracking-[0.2em] md:tracking-[0.35em] uppercase text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] leading-tight">
            Building dreams,<br className="inline md:hidden" /> block by block
          </h2>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 md:mt-12 pointer-events-auto"
        >
          <a 
            href="#about" 
            className="w-full sm:w-auto px-8 py-4 border-2 border-white/80 text-white text-[11px] md:text-xs font-black uppercase tracking-[0.25em] hover:bg-white hover:text-black transition-all duration-300 rounded-[2px] backdrop-blur-md shadow-2xl inline-flex items-center justify-center whitespace-nowrap group"
          >
            <span>About Us</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
          </a>
          <Link 
            to="/virtual-gallery" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-[11px] md:text-xs font-black uppercase tracking-[0.25em] hover:bg-zinc-200 transition-all duration-300 rounded-[2px] shadow-[0_0_35px_rgba(255,255,255,0.25)] inline-flex items-center justify-center whitespace-nowrap group"
          >
            <span>Go To Gallery</span>
            <Maximize2 className="w-3.5 h-3.5 ml-2 opacity-60 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Ambient Noise Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[5] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
};







const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = ARTWORKS.length - 1;
      if (nextIndex >= ARTWORKS.length) nextIndex = 0;
      return nextIndex;
    });
  };

  return (
    <section id="gallery" className="px-6 md:px-20 py-32 bg-zinc-950 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-gradient-reverse py-4 px-6 overflow-visible">
          COMMISSIONED<br />WORKS
        </h2>
        <div className="flex items-center gap-12">
          <p className="max-w-xs text-xs tracking-wider opacity-50 leading-loose hidden lg:block">
            A curated selection of commissioned projects representing unique collaborations and artistic visions.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => paginate(-1)}
              className="w-16 h-16 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => paginate(1)}
              className="w-16 h-16 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all group"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full h-full max-w-7xl px-4 flex flex-col md:flex-row gap-12 items-center"
          >
            <div className="w-full md:w-2/3 h-full relative group overflow-hidden bg-zinc-900">
              <motion.img 
                src={ARTWORKS[currentIndex].image}
                alt={ARTWORKS[currentIndex].title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-75 transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 flex gap-4">
                <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-widest text-white/70 border border-white/10">
                  {ARTWORKS[currentIndex].id.toString().padStart(2, '0')}
                </span>
                <span className="px-4 py-2 bg-black/50 backdrop-blur-md text-[10px] uppercase tracking-widest text-white/70 border border-white/10 uppercase">
                  {ARTWORKS[currentIndex].category}
                </span>
              </div>
            </div>

            <div className="w-full md:w-1/3 flex flex-col justify-center space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 mb-2">Featured Project</p>
                <h3 className="text-4xl md:text-6xl font-display font-black leading-tight text-white uppercase italic">
                  {ARTWORKS[currentIndex].title}
                </h3>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.4 }}
                className="text-white/60 leading-relaxed text-sm md:text-base tracking-wide"
              >
                This piece represents an experimental exploration of light, shadow, and architectural minimalism, pushing the boundaries of digital form through subtle grayscale graduations and stark geometric contrasts.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] hover:text-white transition-colors group">
                  EXPLORE PROJECT <div className="w-12 h-[1px] bg-white transform origin-left group-hover:scale-x-150 transition-transform"></div>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Dots */}
      <div className="mt-20 flex justify-center gap-3">
        {ARTWORKS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > currentIndex ? 1 : -1);
              setCurrentIndex(i);
            }}
            className={`h-1.5 transition-all duration-500 ${
              currentIndex === i ? "w-12 bg-white" : "w-1.5 bg-white/10"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

const CommissionedWorksSection = () => {
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title: string; subtitle: string } | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const COMMISSIONED_IMAGES = [
    { src: "/images/installations/general-installations-1.jpeg", title: "Luxury Residence", subtitle: "Private Estate Commission" },
    { src: "/images/installations/world-map-freedom36.png", title: "World Map Block Art", subtitle: "Freedom 36 Showcase" },
    { src: "/images/installations/blackbrick-imagination-1.jpeg", title: "Blackbrick Project", subtitle: "Architectural Work" },
    { src: "/images/installations/marc-lottering-1.jpeg", title: "Marc Lottering", subtitle: "Iconic Portrait Series" },
    { src: "/images/installations/general-installations-3.jpeg", title: "Cape Town Gallery", subtitle: "Private Collection" },
    { src: "/images/installations/robert-sobukwe-1.jpeg", title: "Robert Sobukwe", subtitle: "Heritage Tribute" },
  ];

  return (
    <section className="bg-white text-black py-20 px-6 md:px-12 lg:px-16 border-t border-black/10">
      <div className="max-w-[1400px] mx-auto">
        {/* 1. Header: COMMISSIONED WORK */}
        <div className="mb-8 pb-4 border-b border-black/15">
          <h2 className="text-xs md:text-sm font-extrabold uppercase tracking-[0.3em] text-black">
            COMMISSIONED WORK
          </h2>
          <div className="w-12 h-[2px] bg-black mt-2"></div>
        </div>

        {/* 2. Expanding Accordion Gallery - Smoothly expands hovered image and pushes adjacent images aside */}
        <div 
          onMouseLeave={() => setHoveredIdx(null)}
          className="flex flex-col lg:flex-row gap-3 md:gap-4 h-[650px] sm:h-[550px] lg:h-[520px] mb-20"
        >
          {COMMISSIONED_IMAGES.map((img, idx) => {
            const isHovered = hoveredIdx === idx;
            const isAnyHovered = hoveredIdx !== null;
            
            // Dynamic flex-grow ratio: hovered card expands to 3.5x width while others shrink smoothly
            const flexStyle = isHovered 
              ? 'lg:flex-[3.5] flex-[2]' 
              : isAnyHovered 
                ? 'lg:flex-[0.8] flex-1' 
                : 'flex-1';

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setLightboxImg(img)}
                className={`group overflow-hidden bg-zinc-900 relative border border-black/10 cursor-pointer shadow-xs hover:shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] rounded-sm ${flexStyle}`}
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                    isHovered ? 'grayscale-0 scale-105 brightness-105' : 'grayscale brightness-90 hover:brightness-100'
                  }`}
                />
                
                {/* Expand Icon Indicator on Hover */}
                <div className={`absolute top-4 right-4 transition-all duration-500 z-20 ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}>
                  <div className="w-8 h-8 rounded-full bg-black/80 text-white flex items-center justify-center backdrop-blur-xs shadow-lg">
                    <Maximize2 size={14} />
                  </div>
                </div>

                {/* Title Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 z-10 transition-opacity duration-500 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <span className="text-white text-xs md:text-sm font-black uppercase tracking-wider leading-tight drop-shadow-md">
                    {img.title}
                  </span>
                  <span className="text-white/70 text-[10px] md:text-xs font-mono uppercase tracking-widest mt-1">
                    {img.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fullscreen Expand Lightbox Modal */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-10 cursor-pointer"
            >
              <div className="flex items-center justify-between text-white border-b border-white/10 pb-4">
                <div>
                  <h4 className="text-lg font-bold uppercase tracking-wider">{lightboxImg.title}</h4>
                  <p className="text-xs font-mono text-zinc-400">{lightboxImg.subtitle}</p>
                </div>
                <button
                  onClick={() => setLightboxImg(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white hover:text-black text-white flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center py-6">
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  src={lightboxImg.src}
                  alt={lightboxImg.title}
                  className="max-h-[80vh] max-w-full object-contain rounded-xs border border-white/20 shadow-2xl"
                />
              </div>

              <div className="text-center text-xs font-mono text-white/50 tracking-widest uppercase pb-2">
                Click anywhere to close preview
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. 3-Column Features (Crafted by Hand, Original Concepts, Built to Last) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 py-16 border-t border-b border-black/15 text-center">
          {/* Column 1 */}
          <div className="flex flex-col items-center px-6 md:border-r border-black/15">
            <LayoutGrid size={36} className="text-black mb-5 stroke-[1.4]" />
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-black mb-3">
              CRAFTED BY HAND
            </h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed max-w-xs font-normal">
              Each piece is carefully assembled block by block.
            </p>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-center px-6 md:border-r border-black/15">
            <Box size={36} className="text-black mb-5 stroke-[1.4]" />
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-black mb-3">
              ORIGINAL CONCEPTS
            </h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed max-w-xs font-normal">
              Custom designs created to reflect your story and space.
            </p>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-center px-6">
            <ShieldCheck size={36} className="text-black mb-5 stroke-[1.4]" />
            <h3 className="text-xs font-black uppercase tracking-[0.25em] text-black mb-3">
              BUILT TO LAST
            </h3>
            <p className="text-zinc-600 text-xs md:text-sm leading-relaxed max-w-xs font-normal">
              Premium materials ensure timeless quality and detail.
            </p>
          </div>
        </div>

        {/* 4. 50/50 Split CTA Banner: LET'S CREATE SOMETHING EXTRAORDINARY. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 mt-20 border border-black/10 overflow-hidden bg-black text-white">
          {/* Left Text Side */}
          <div className="bg-black text-white p-10 md:p-16 lg:p-20 flex flex-col justify-center items-start">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-tighter leading-[0.92] text-white mb-8">
              LET'S CREATE<br />
              SOMETHING<br />
              EXTRAORDINARY.
            </h2>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-black text-[11px] font-extrabold uppercase tracking-[0.25em] hover:bg-zinc-200 transition-colors inline-flex items-center gap-3 rounded-[2px]"
            >
              GET IN TOUCH <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right Image Side */}
          <div className="relative min-h-[380px] lg:min-h-[500px] overflow-hidden bg-zinc-950">
            <img
              src="/images/installations/hero.jpg"
              alt="Art Installation Space"
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setLoading(true);
    try {
      await addDoc(collection(db, "inquiries"), {
        name,
        email,
        message,
        inquiryType: "General Inquiry",
        status: "unread",
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="px-6 md:px-20 py-32 bg-black border-t border-white/5 relative overflow-hidden">
      {/* Background Text Distortion */}
      <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none">
        <h2 className="text-[40vw] font-black leading-none -mr-16">HIRE</h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* Left Column: Information & Status */}
          <div className="lg:col-span-5 flex flex-col justify-between py-4">
            <div>
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tight text-gradient-reverse leading-tight mb-6 py-4 px-6 overflow-visible">
                Let's connect
              </h2>

              <p className="text-white/60 mb-12 max-w-sm text-sm leading-relaxed">
                Have a project in mind or just want to say hello? Fill out the form or reach out directly. We'd love to hear from you.
              </p>
              
              <div className="space-y-12">
                <div className="group cursor-pointer">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 font-bold">Studio HQ — Blackheath, SA</p>
                  <p className="text-xl md:text-2xl text-white/80 font-display">
                    Unit 2, 15 Muscat road<br />Saxenburg Park 1, Blackheath
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4 font-bold">General Inquiries</p>
                    <div className="flex flex-col gap-3">
                      <a href="mailto:info@ianart.co.za" className="text-2xl md:text-3xl font-display font-bold hover:tracking-widest transition-all duration-500 underline decoration-white/20 underline-offset-8 w-fit">
                        info@ianart.co.za
                      </a>
                      <a href="tel:0838008834" className="text-xl md:text-2xl font-display font-bold hover:tracking-widest transition-all duration-500 text-white/60 w-fit">
                        083 800 8834
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Modernized Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/40 backdrop-blur-3xl p-8 md:p-16 border border-white/5 relative group"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20"></div>

              <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-10 text-center font-bold">Contact Form</p>
              
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <h3 className="text-3xl font-display font-bold text-white uppercase tracking-tight">Message Sent!</h3>
                  <p className="text-zinc-400 text-sm font-light max-w-sm mx-auto">
                    Thank you for reaching out. We have received your inquiry and will get back to you shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-8 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all rounded-[2px]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="relative group/input">
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="peer w-full bg-transparent border-b border-white/10 py-3 focus:border-white focus:outline-hidden transition-all font-display text-xl text-white placeholder:opacity-0"
                      id="user_name"
                    />
                    <label 
                      htmlFor="user_name"
                      className="absolute left-0 top-3 text-lg md:text-xl font-display text-white/30 pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.4em] peer-focus:text-white/60 peer-valid:-top-5 peer-valid:text-[10px] peer-valid:uppercase peer-valid:tracking-[0.4em] peer-valid:text-white/60"
                    >
                      Name
                    </label>
                  </div>

                  <div className="relative group/input">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="peer w-full bg-transparent border-b border-white/10 py-3 focus:border-white focus:outline-hidden transition-all font-display text-xl text-white placeholder:opacity-0"
                      id="user_email"
                    />
                    <label 
                      htmlFor="user_email"
                      className="absolute left-0 top-3 text-lg md:text-xl font-display text-white/30 pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.4em] peer-focus:text-white/60 peer-valid:-top-5 peer-valid:text-[10px] peer-valid:uppercase peer-valid:tracking-[0.4em] peer-valid:text-white/60"
                    >
                      Email
                    </label>
                  </div>

                  <div className="relative group/input">
                    <textarea 
                      rows={3}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="peer w-full bg-transparent border-b border-white/10 py-3 focus:border-white focus:outline-hidden transition-all font-display text-xl text-white placeholder:opacity-0 resize-none"
                      id="user_message"
                    />
                    <label 
                      htmlFor="user_message"
                      className="absolute left-0 top-3 text-lg md:text-xl font-display text-white/30 pointer-events-none transition-all peer-focus:-top-5 peer-focus:text-[10px] peer-focus:uppercase peer-focus:tracking-[0.4em] peer-focus:text-white/60 peer-valid:-top-5 peer-valid:text-[10px] peer-valid:uppercase peer-valid:tracking-[0.4em] peer-valid:text-white/60"
                    >
                      Message
                    </label>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center justify-between pt-6">
                    <p className="text-[9px] uppercase tracking-[0.2em] text-white/30 max-w-[200px]">We'll get back to you as soon as possible.</p>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="group relative px-12 py-5 bg-white text-black font-display font-black text-sm uppercase tracking-widest overflow-hidden transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {loading ? "SENDING..." : "SUBMIT"} <ArrowRight size={16} />
                      </span>
                      <motion.div 
                        className="absolute inset-0 bg-zinc-200"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: 0 }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                      />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ArtisticWords = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001
  });

  // Overall section fade and scale - maintains visibility to prevent blank black screen gaps
  const overallOpacity = useTransform(smoothProgress, [0, 0.01, 0.98, 1], [0.8, 1, 1, 0.8]);
  const overallScale = useTransform(smoothProgress, [0, 0.01, 0.98, 1], [0.95, 1, 1, 0.98]);

  // Immediate popping up as soon as user scrolls once (0.01 onwards)
  // Phrase 0: "IT'S ABOUT TIME"
  const phrase0Opacity = useTransform(smoothProgress, [0.01, 0.07], [0, 1]);
  const phrase0Scale = useTransform(smoothProgress, [0.01, 0.07], [0.85, 1]);
  const phrase0Y = useTransform(smoothProgress, [0.01, 0.07], [15, 0]);

  // Phrase 8: "offline"
  const phrase8Opacity = useTransform(smoothProgress, [0.02, 0.08], [0, 1]);
  const phrase8Y = useTransform(smoothProgress, [0.02, 0.08], [-10, 0]);

  // Phrase 1: "let's face it"
  const phrase1Opacity = useTransform(smoothProgress, [0.04, 0.12], [0, 1]);
  const phrase1X = useTransform(smoothProgress, [0.04, 0.12], [-40, 0]);

  // Phrase 9: "perspective"
  const phrase9Opacity = useTransform(smoothProgress, [0.07, 0.15], [0, 1]);
  const phrase9X = useTransform(smoothProgress, [0.07, 0.15], [-20, 0]);

  // Phrase 3: "let's unplug"
  const phrase3Opacity = useTransform(smoothProgress, [0.10, 0.18], [0, 1]);
  const phrase3Blur = useTransform(smoothProgress, [0.10, 0.18], ["blur(10px)", "blur(0px)"]);

  // Phrase 2: "DON'T GIVE UP"
  const phrase2Opacity = useTransform(smoothProgress, [0.13, 0.22], [0, 1]);
  const phrase2Scale = useTransform(smoothProgress, [0.13, 0.22], [0.75, 1]);
  const phrase2Y = useTransform(smoothProgress, [0.13, 0.22], [20, 0]);

  // Phrase 5: "stay focused"
  const phrase5Opacity = useTransform(smoothProgress, [0.17, 0.25], [0, 1]);
  const phrase5Y = useTransform(smoothProgress, [0.17, 0.25], [10, 0]);

  // Phrase 11: "deep story"
  const phrase11Opacity = useTransform(smoothProgress, [0.21, 0.29], [0, 1]);
  const phrase11Y = useTransform(smoothProgress, [0.21, 0.29], [10, 0]);

  // Phrase 4: "SCREW IT"
  const phrase4Opacity = useTransform(smoothProgress, [0.25, 0.35], [0, 1]);
  const phrase4Scale = useTransform(smoothProgress, [0.25, 0.35], [0.7, 1]);
  const phrase4Y = useTransform(smoothProgress, [0.25, 0.35], [30, 0]);

  // Phrase 10: "HORSEJA"
  const phrase10Opacity = useTransform(smoothProgress, [0.30, 0.38], [0, 1]);
  const phrase10Scale = useTransform(smoothProgress, [0.30, 0.38], [0.7, 1]);

  // Phrase 13: "we the people"
  const phrase13Opacity = useTransform(smoothProgress, [0.34, 0.42], [0, 1]);
  const phrase13X = useTransform(smoothProgress, [0.34, 0.42], [15, 0]);

  // Phrase 12: "UNSHAKABLE FAITH"
  const phrase12Opacity = useTransform(smoothProgress, [0.38, 0.46], [0, 1]);
  const phrase12Scale = useTransform(smoothProgress, [0.38, 0.46], [0.8, 1]);

  // Phrase 6: "RISE TO REALIZE"
  const phrase6Opacity = useTransform(smoothProgress, [0.42, 0.50], [0, 1]);
  const phrase6Scale = useTransform(smoothProgress, [0.42, 0.50], [0.8, 1]);
  const phrase6Rotate = useTransform(smoothProgress, [0.42, 0.50], [-3, 0]);

  // Phrase 7 word transforms (it is what it is - word by word)
  const word0Opacity = useTransform(smoothProgress, [0.48, 0.50], [0, 1]);
  const word0Y = useTransform(smoothProgress, [0.48, 0.50], [8, 0]);

  const word1Opacity = useTransform(smoothProgress, [0.50, 0.52], [0, 1]);
  const word1Y = useTransform(smoothProgress, [0.50, 0.52], [8, 0]);

  const word2Opacity = useTransform(smoothProgress, [0.52, 0.54], [0, 1]);
  const word2Y = useTransform(smoothProgress, [0.52, 0.54], [8, 0]);

  const word3Opacity = useTransform(smoothProgress, [0.54, 0.56], [0, 1]);
  const word3Y = useTransform(smoothProgress, [0.54, 0.56], [8, 0]);

  const word4Opacity = useTransform(smoothProgress, [0.56, 0.58], [0, 1]);
  const word4Y = useTransform(smoothProgress, [0.56, 0.58], [8, 0]);

  return (
    <section id="philosophy" ref={containerRef} className="relative h-[220vh] bg-black">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center px-4 pt-24 md:pt-28 pb-8 overflow-hidden">
        <motion.div 
          style={{ scale: overallScale, opacity: overallOpacity }}
          className="flex flex-col items-center justify-center max-w-7xl w-full text-center gap-y-0 md:gap-y-0.5 px-2 md:px-6 my-auto"
        >
          {/* Row 1: offline + IT'S ABOUT TIME + let's face it */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-6 gap-y-0 leading-none">
            <motion.span
              style={{ opacity: phrase8Opacity, y: phrase8Y }}
              className="text-sm sm:text-xl md:text-2xl font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold"
            >
              offline
            </motion.span>
            <motion.span
              style={{ opacity: phrase0Opacity, scale: phrase0Scale, y: phrase0Y }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-display text-gradient-reverse inline-block leading-none tracking-tighter"
            >
              IT'S ABOUT TIME
            </motion.span>
            <motion.span
              style={{ opacity: phrase1Opacity, x: phrase1X }}
              className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-light italic font-display text-zinc-300"
            >
              let's face it
            </motion.span>
          </div>

          {/* Row 2: perspective + let's unplug + DON'T GIVE UP + stay focused */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-6 gap-y-0 leading-none">
            <motion.span
              style={{ opacity: phrase9Opacity, x: phrase9X }}
              className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-light italic font-display text-zinc-400"
            >
              perspective
            </motion.span>
            <motion.span
              style={{ opacity: phrase3Opacity, filter: phrase3Blur }}
              className="text-xs sm:text-lg md:text-xl font-thin tracking-[0.2em] font-display text-zinc-400"
            >
              let's unplug
            </motion.span>
            <motion.span
              style={{ opacity: phrase2Opacity, scale: phrase2Scale, y: phrase2Y }}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display text-gradient-reverse inline-block leading-none tracking-tighter"
            >
              DON'T GIVE UP
            </motion.span>
            <motion.span
              style={{ opacity: phrase5Opacity, y: phrase5Y }}
              className="text-sm sm:text-xl md:text-2xl font-semibold font-display text-zinc-300"
            >
              stay focused
            </motion.span>
          </div>

          {/* Row 3: deep story + SCREW IT + HORSEJA */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-6 gap-y-0 leading-none">
            <motion.span
              style={{ opacity: phrase11Opacity, y: phrase11Y }}
              className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-mono italic text-zinc-400"
            >
              deep story
            </motion.span>
            <motion.span
              style={{ opacity: phrase4Opacity, scale: phrase4Scale, y: phrase4Y }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[9.5rem] font-black font-display text-gradient-reverse inline-block leading-[0.85] tracking-tighter"
            >
              SCREW IT
            </motion.span>
            <motion.span
              style={{ opacity: phrase10Opacity, scale: phrase10Scale }}
              className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-widest font-display text-zinc-200"
            >
              HORSEJA
            </motion.span>
          </div>

          {/* Row 4: WE THE PEOPLE + UNSHAKABLE FAITH + RISE TO REALIZE */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-5 md:gap-x-6 gap-y-0 leading-none">
            <motion.span
              style={{ opacity: phrase13Opacity, x: phrase13X }}
              className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold uppercase tracking-[0.18em] font-display text-zinc-300"
            >
              we the people
            </motion.span>
            <motion.span
              style={{ opacity: phrase12Opacity, scale: phrase12Scale }}
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-display text-gradient-reverse inline-block leading-none tracking-tighter"
            >
              UNSHAKABLE FAITH
            </motion.span>
            <motion.span
              style={{ opacity: phrase6Opacity, scale: phrase6Scale, rotate: phrase6Rotate }}
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold font-display text-gradient-reverse inline-block leading-none tracking-tighter"
            >
              RISE TO REALIZE
            </motion.span>
          </div>

          {/* Row 5: it is what it is */}
          <div className="flex justify-center w-full pt-1">
            <motion.span
              className="text-sm sm:text-lg md:text-xl font-mono text-zinc-400 font-display inline-block leading-none tracking-wide"
            >
              <motion.span style={{ opacity: word0Opacity, y: word0Y }} className="inline-block mr-2">it</motion.span>
              <motion.span style={{ opacity: word1Opacity, y: word1Y }} className="inline-block mr-2">is</motion.span>
              <motion.span style={{ opacity: word2Opacity, y: word2Y }} className="inline-block mr-2">what</motion.span>
              <motion.span style={{ opacity: word3Opacity, y: word3Y }} className="inline-block mr-2">it</motion.span>
              <motion.span style={{ opacity: word4Opacity, y: word4Y }} className="inline-block">is</motion.span>
            </motion.span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const CounterText = ({ progress }: { progress: any }) => {
  const [text, setText] = useState("0+");

  useEffect(() => {
    const unsubscribe = progress.on("change", (latest: number) => {
      let countVal = 0;
      if (latest > 0.05) {
        countVal = Math.min(1000000, Math.floor(((latest - 0.05) / 0.85) * 1000000));
      }
      setText(countVal.toLocaleString() + "+");
    });
    return () => unsubscribe();
  }, [progress]);

  return <span>{text}</span>;
};

const CollageSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(1);
  const frameCount = 180;

  const renderFrame = useCallback((index: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const idx = Math.min(Math.max(0, Math.floor(index)), frameCount - 1);
    
    // Find the closest available loaded image if exact frame isn't ready
    let img = imagesRef.current[idx];
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = imagesRef.current.find(i => i && i.complete && i.naturalWidth > 0) as HTMLImageElement;
    }
    
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const x = (canvas.width / 2) - (img.width / 2) * scale;
    const y = (canvas.height / 2) - (img.height / 2) * scale;
    context.drawImage(img, x, y, img.width * scale, img.height * scale);
  }, []);

  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(frameCount);

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `/images/yero-images/ezgif-frame-${i.toString().padStart(3, '0')}.jpg`;
      img.onload = () => {
        imgs[i - 1] = img;
        imagesRef.current = imgs;
        if (i === 1 || i === currentFrameRef.current) {
          renderFrame(currentFrameRef.current);
        }
      };
    }
  }, [renderFrame]);

  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };

    window.addEventListener('resize', handleResize);
    renderFrame(currentFrameRef.current);

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(self.progress * (frameCount - 1))));
        currentFrameRef.current = frameIndex;
        renderFrame(frameIndex);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      st.kill();
    };
  }, [renderFrame]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 32,
    restDelta: 0.0001
  });

  // Header fades smoothly as the user scrubs through the block assembly
  const headerOpacity = useTransform(smoothProgress, [0, 0.05, 0.35, 0.55], [0.9, 1, 0.4, 0]);
  const headerScale = useTransform(smoothProgress, [0, 0.3], [0.95, 1.05]);
  const headerY = useTransform(smoothProgress, [0, 0.4], [0, -60]);

  // Completion badges and overlay elements
  const completionOpacity = useTransform(smoothProgress, [0.82, 0.92, 0.98], [0, 1, 0.6]);

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-black select-none">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover z-[1]"
        />
        
        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-transparent to-black pointer-events-none z-[2]" />

        {/* Progress Guide - Minimalist indicator */}
        <div className="absolute left-6 md:left-20 bottom-12 z-50 flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold">
          <div className="w-12 h-[1px] bg-white/10 relative overflow-hidden">
            <motion.div 
              style={{ x: useTransform(smoothProgress, [0, 1], ["-100%", "0%"]) }} 
              className="absolute inset-0 bg-white"
            />
          </div>
          <span className="hidden sm:inline">Mosaic Assembly</span>
        </div>

        {/* Counter Stat Display */}
        <div className="absolute right-6 md:right-20 bottom-12 z-50 text-right">
          <motion.div
            style={{ opacity: useTransform(smoothProgress, [0.03, 0.15, 0.92, 0.98], [0, 1, 1, 0]) }}
            className="flex flex-col items-end"
          >
            <motion.span className="text-3xl md:text-5xl font-display font-black text-white leading-none tracking-tight">
              <CounterText progress={smoothProgress} />
            </motion.span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 mt-2 font-bold">
              BLOCKS PACKED
            </span>
          </motion.div>
        </div>

        {/* Section Header */}
        <motion.div 
          style={{ opacity: headerOpacity, scale: headerScale, y: headerY }}
          className="absolute z-30 text-center pointer-events-none px-4"
        >
          <p className="text-xs md:text-sm font-mono tracking-[0.4em] text-white/50 uppercase mb-4">
            Master Mosaic Series
          </p>
          <h2 className="text-5xl md:text-8xl font-display font-black tracking-tighter text-gradient leading-none">
            BUILDING DREAMS<br />BLOCK BY BLOCK
          </h2>
          <p className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/40 uppercase mt-4">
            Scroll to watch the artwork assemble
          </p>
        </motion.div>

        {/* Completion Tag Badge */}
        <motion.div
          style={{ opacity: completionOpacity }}
          className="absolute bottom-28 md:bottom-24 z-30 text-center flex flex-col items-center gap-1.5 pointer-events-none px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.25em] text-white font-bold">
              Sculpted Relief Complete · 100% Handcrafted
            </span>
          </div>
        </motion.div>

        {/* Ambient Noise Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />
      </div>
    </section>
  );
};

const StudioSection = () => {
  return (
    <section id="about" className="px-6 md:px-20 py-32 bg-black border-y border-white/5 relative overflow-hidden">
      {/* Background Decorative Text */}
      <div className="absolute top-10 right-10 opacity-[0.03] pointer-events-none select-none hidden lg:block">
        <h2 className="text-[20vw] font-black leading-none">IAN</h2>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          
          {/* Image Side */}
          <div className="relative group">
            <div className="absolute -top-6 -left-6 w-24 h-24 border-t-2 border-l-2 border-white/20 z-20"></div>
            <div className="relative aspect-[4/5] overflow-hidden grayscale">
              <motion.img 
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 1.5 }}
                src="/images/ian-portrait-new.jpeg" 
                alt="Ian Art Albertyn - Founder"
                className="w-full h-full object-cover opacity-90 transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            {/* Floating Quote inspired by the mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="absolute -bottom-4 -right-4 md:-bottom-8 md:-right-8 p-6 md:p-8 bg-zinc-900/90 backdrop-blur-2xl border border-white/10 max-w-[240px] md:max-w-xs shadow-2xl z-30"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-3 font-bold">Artist Perspective</p>
              <p className="text-xs md:text-sm italic leading-relaxed text-white/90 uppercase tracking-widest font-bold">
                "An artist is someone with the gift to light a dark room."
              </p>
              <p className="text-[8px] uppercase tracking-widest text-white/20 mt-4">— ERIC CANTONA</p>
            </motion.div>
          </div>

          {/* Text Side */}
          <div className="space-y-12">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.5em] text-white/40 font-bold">IAN ALBERTYN — FOUNDER</p>
                <h2 className="text-3xl md:text-5xl font-display font-black tracking-tighter text-white leading-[1.1] uppercase">
                  Ian Art Albertyn's <br/>
                  Visionary Artistry
                </h2>
              </div>

              <div className="space-y-8 text-white/60 text-base md:text-lg leading-relaxed max-w-xl font-light">
                <p>
                  I am Ian Art Albertyn, a visionary artist from Cape Town, South Africa. Born on February 5, 1982. Art has always been my true calling, allowing me to express my emotions and beliefs.
                </p>
                <p>
                  Raised in a Christian home, I value compassion and positivity. My art draws inspiration from nature and people's diverse perspectives, reflecting the beauty and complexity of our world.
                </p>
                <p>
                  Through my art, I aim to make a difference, lending a hand to those in need and raising awareness for important causes. Using wooden blocks, I create art that symbolizes building dreams block by BLOCK. Together, we can shape a brighter world.
                </p>
                <p className="pt-4 text-white/40 italic">
                  Join me on this inspiring journey of love, unity, and endless possibilities..
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface FastCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

const FastCounter: React.FC<FastCounterProps> = ({ target, suffix = "+", duration = 1400 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutExpo = (x: number): number => {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    };

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);

      const currentVal = Math.floor(eased * target);
      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, target, duration]);

  return (
    <span ref={nodeRef} className="tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

const StatsSection = () => {
  const STATS_DATA = [
    {
      icon: Boxes,
      target: 1000000,
      suffix: "+",
      label: "Blocks placed"
    },
    {
      icon: Clock,
      target: 10000,
      suffix: "+",
      label: "Hours of creation"
    },
    {
      icon: Frame,
      target: 250,
      suffix: "+",
      label: "Artworks completed"
    },
    {
      icon: Users,
      target: 100,
      suffix: "+",
      label: "Happy clients"
    }
  ];

  return (
    <section className="bg-black py-20 md:py-28 px-6 md:px-12 lg:px-16 xl:px-20 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Story */}
          <div className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-4 md:space-y-6"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-white/40 font-bold">
                MORE THAN ART
              </p>
              
              <h2 className="text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-display font-black text-white tracking-tight leading-[1.12]">
                Every Block <br className="hidden sm:inline" />Tells a Story
              </h2>
              
              <p className="text-white/60 text-sm md:text-base leading-relaxed font-light max-w-lg pt-1">
                Ian Art Albertyn transforms simple wooden blocks into extraordinary works of art that speak to the soul. Through unity, patience and precision, we create pieces that inspire, connect and leave a lasting impression.
              </p>
            </motion.div>
          </div>

          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:flex lg:col-span-1 justify-center">
            <div className="w-[1px] h-64 bg-white/10" />
          </div>

          {/* Right Side: 4 Stat Metrics */}
          <div className="lg:col-span-7 xl:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10"
            >
              {STATS_DATA.map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div 
                    key={idx}
                    className="flex flex-col items-center text-center px-3 sm:px-4 md:px-5 py-6 sm:py-2 group"
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white mb-5 bg-white/5 border border-white/10 shadow-xl transition-transform group-hover:scale-105 shrink-0">
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>

                    <div className="w-full flex justify-center items-center py-1">
                      <span className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-display font-black text-white tracking-tighter whitespace-nowrap">
                        <FastCounter target={stat.target} suffix={stat.suffix} duration={1400} />
                      </span>
                    </div>

                    <div className="w-full flex flex-col items-center justify-start mt-2">
                      <span className="text-xs md:text-sm text-white/60 font-medium tracking-wide text-center leading-snug">
                        {stat.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <main>
      <YeroSection />
      <StudioSection />
      <StatsSection />
      <ArtisticWords />
      <CollageSection />
      <CommissionedWorksSection />
    </main>
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageMetadataUpdater = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "IAN ART | Building dreams, block by block",
      "/home-2": "IAN ART | Building dreams, block by block",
      "/about": "About Us | IAN ART",
      "/commissioned-works": "Commissioned Works | IAN ART",
      "/virtual-gallery": "3D Virtual Gallery | IAN ART — Building dreams, block by block",
      "/exhibitions": "Exhibitions & Public Works | IAN ART",
      "/installations": "Architectural Installations | IAN ART",
      "/qr-art": "Interactive QR Art | IAN ART",
      "/contact": "Contact & Inquiries | IAN ART",
      "/login": "Admin Authentication | IAN ART",
      "/admin": "Studio Admin Management | IAN ART",
    };

    document.title = titles[pathname] || "IAN ART | Building dreams, block by block";
  }, [pathname]);

  return null;
};

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/admin" || pathname === "/login";
  const isGalleryPage = pathname === "/virtual-gallery";
  const hideLayout = isAuthPage || isGalleryPage;
  
  return (
    <>
      <ScrollToTop />
      <PageMetadataUpdater />
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
      <DonateButton />
      <WhatsAppButton />
    </>
  );
};



export default function App() {
  return (
    <Router>
      <ReactLenis root options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 0.8,
        touchMultiplier: 1.5,
        infinite: false,
      }}>
        <div className="min-h-screen bg-black selection:bg-white selection:text-black font-sans">
          
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home2 />} />
              <Route path="/home-2" element={<Home2 />} />
              <Route path="/about" element={<About />} />
              <Route path="/commissioned-works" element={<CommissionedWorks />} />
              <Route path="/virtual-gallery" element={<VirtualGallery />} />
              <Route path="/exhibitions" element={<Exhibitions />} />
              <Route path="/installations" element={<Installations />} />
              <Route path="/qr-art" element={<QRArt />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </MainLayout>
          
          <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
        </div>
      </ReactLenis>
    </Router>
  );
}
