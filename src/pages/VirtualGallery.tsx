import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const VirtualGallery: React.FC = () => {
  return (
    <div className="relative w-screen h-[100dvh] bg-black overflow-hidden">
      <Link
        to="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
      >
        <ArrowLeft size={13} />
        <span>Back to IAN ART</span>
      </Link>

      <iframe
        src="/vr-gallery/index.html"
        title="IAN ART Virtual Reality Gallery"
        className="w-full h-full border-0 block"
        allow="fullscreen; xr-spatial-tracking; autoplay; accelerometer; gyroscope"
        allowFullScreen
      />
    </div>
  );
};

export default VirtualGallery;
