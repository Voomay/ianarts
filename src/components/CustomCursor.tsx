import { useEffect, useRef, useState, useCallback } from "react";

export const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const outerPos = useRef({ x: 0, y: 0 });
  const innerPos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const getInteractionType = useCallback((target: HTMLElement): "link" | "text" | null => {
    // Check for interactive elements
    const isInteractive =
      target.tagName === "A" ||
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.tagName === "SELECT" ||
      target.closest("a") ||
      target.closest("button") ||
      target.getAttribute("role") === "button" ||
      target.classList.contains("cursor-pointer") ||
      window.getComputedStyle(target).cursor === "pointer";

    if (isInteractive) return "link";

    // Check for text content that might be interesting
    const isTextContent =
      target.tagName === "P" ||
      target.tagName === "H1" ||
      target.tagName === "H2" ||
      target.tagName === "H3" ||
      target.tagName === "H4" ||
      target.tagName === "H5" ||
      target.tagName === "H6" ||
      target.tagName === "SPAN" ||
      target.tagName === "LABEL";

    if (isTextContent && target.textContent && target.textContent.trim().length > 0) return "text";

    return null;
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const type = getInteractionType(target);
      setIsHovering(type === "link");
      setIsTextHover(type === "text");
    };

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, getInteractionType]);

  // RAF-driven animation loop — silky smooth, independent of React renders
  useEffect(() => {
    const animate = () => {
      // Inner dot: fast lerp (responsive)
      innerPos.current.x += (mousePos.current.x - innerPos.current.x) * 0.35;
      innerPos.current.y += (mousePos.current.y - innerPos.current.y) * 0.35;

      // Outer ring: slow lerp (trailing)
      outerPos.current.x += (mousePos.current.x - outerPos.current.x) * 0.12;
      outerPos.current.y += (mousePos.current.y - outerPos.current.y) * 0.12;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${innerPos.current.x}px, ${innerPos.current.y}px, 0)`;
      }

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0)`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  // Determine outer ring size
  const outerSize = isHovering ? 56 : isTextHover ? 40 : isPressed ? 24 : 36;
  const outerOpacity = isHovering ? 0.9 : isTextHover ? 0.3 : 0.5;
  const innerOpacity = isHovering ? 0 : 1;

  return (
    <>
      {/* Outer ring — trails behind gracefully */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          width: outerSize,
          height: outerSize,
          marginLeft: -outerSize / 2,
          marginTop: -outerSize / 2,
          opacity: isVisible ? outerOpacity : 0,
          border: "1.5px solid white",
          borderRadius: "50%",
          transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), margin 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease",
          willChange: "transform",
          backdropFilter: isHovering ? "invert(1)" : "none",
        }}
      />

      {/* Inner dot — stays close to real cursor */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          backgroundColor: "white",
          opacity: isVisible ? innerOpacity : 0,
          transition: "opacity 0.3s ease, width 0.3s ease, height 0.3s ease",
          willChange: "transform",
        }}
      />
    </>
  );
};
