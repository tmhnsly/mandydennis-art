import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { fullUrl } from "../lib/content";
import type { Artwork } from "../types";

interface Props {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function ArtworkLightbox({ items, index, onClose, onChange }: Props) {
  const isOpen = index >= 0;
  const current = isOpen && index < items.length ? items[index] : null;
  const tags = current ? [...(current.medium ?? []), ...(current.subject ?? [])] : [];
  const touchStart = useRef<number | null>(null);
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [isNavigating, setIsNavigating] = useState(false);

  // Once lightbox is open and the initial layoutId animation has settled,
  // switch to slide mode for prev/next
  useEffect(() => {
    if (isOpen) {
      const timer = window.setTimeout(() => setIsNavigating(true), 500);
      return () => clearTimeout(timer);
    }
    setIsNavigating(false);
    setDirection(0);
  }, [isOpen]);

  const goPrev = useCallback(() => {
    if (items.length <= 1) return;
    setDirection(-1);
    onChange(index === 0 ? items.length - 1 : index - 1);
  }, [index, items.length, onChange]);

  const goNext = useCallback(() => {
    if (items.length <= 1) return;
    setDirection(1);
    onChange(index === items.length - 1 ? 0 : index + 1);
  }, [index, items.length, onChange]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goPrev, goNext]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goPrev() : goNext();
    }
    touchStart.current = null;
  };

  // Slide variants for navigating between images
  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
          onClick={onClose}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <FaTimes size={14} className="text-white/80" />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition-colors hidden sm:flex"
              aria-label="Previous"
            >
              <FaChevronLeft size={14} className="text-white/80" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              {isNavigating ? (
                /* Slide transition for prev/next navigation */
                <motion.img
                  key={current.slug}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
                  src={fullUrl(current.image)}
                  alt={current.title}
                  className="max-h-[78vh] max-w-[90vw] object-contain rounded-sm"
                />
              ) : (
                /* layoutId spring for open/close from grid */
                <motion.img
                  key={current.slug}
                  layoutId={`artwork-${current.slug}`}
                  src={fullUrl(current.image)}
                  alt={current.title}
                  className="max-h-[78vh] max-w-[90vw] object-contain rounded-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
                />
              )}
            </AnimatePresence>

            {/* Tags */}
            <AnimatePresence mode="wait">
              {tags.length > 0 && (
                <motion.div
                  key={current.slug + "-tags"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-center gap-1.5 mt-4 flex-wrap px-4"
                >
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/60 border border-white/10 bg-white/5 backdrop-blur-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center transition-colors hidden sm:flex"
              aria-label="Next"
            >
              <FaChevronRight size={14} className="text-white/80" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
