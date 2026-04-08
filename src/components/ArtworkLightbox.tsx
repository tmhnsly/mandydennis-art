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
  const [direction, setDirection] = useState(0);

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

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -120 : 120, opacity: 0 }),
  };

  if (!isOpen || !current) return null;

  const btnClass = "w-11 h-11 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <button onClick={onClose} className={`absolute top-4 right-4 z-10 ${btnClass}`} aria-label="Close">
        <FaTimes size={14} className="text-white/80" />
      </button>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 ${btnClass}`}
          aria-label="Previous"
        >
          <FaChevronLeft size={14} className="text-white/80" />
        </button>
      )}

      {/* Image */}
      <div className="relative flex flex-col items-center px-14 sm:px-16 max-w-full" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
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
            className="max-h-[78vh] max-w-full object-contain rounded-sm"
            style={{ viewTransitionName: `artwork-${current.slug}` }}
          />
        </AnimatePresence>

        {/* Tags */}
        <AnimatePresence mode="wait">
          {tags.length > 0 && (
            <motion.div
              key={current.slug + "-tags"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center gap-1.5 mt-4 flex-wrap"
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
          className={`absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 ${btnClass}`}
          aria-label="Next"
        >
          <FaChevronRight size={14} className="text-white/80" />
        </button>
      )}
    </div>
  );
}
