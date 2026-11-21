import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const VirtualGallery: React.FC = () => {
  return (
    <div className="relative w-screen h-[100dvh] bg-black overflow-hidden">
      <Link
        to="/"
        aria-label="Back to IAN ART"
        title="Back to IAN ART"
        className="fixed top-16 left-4 md:top-20 md:left-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/85 text-white backdrop-blur-md hover:bg-white hover:text-black transition-all duration-300 shadow-lg"
      >
        <ArrowLeft size={17} />
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
