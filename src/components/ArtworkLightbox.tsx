import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { fullUrl, thumbnailUrl } from "../lib/content";
import type { Artwork } from "../types";

interface Props {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

function wrap(i: number, len: number) {
  return ((i % len) + len) % len;
}

export default function ArtworkLightbox({ items, index, onClose, onChange }: Props) {
  const isOpen = index >= 0;
  const current = isOpen && index < items.length ? items[index] : null;
  const tags = current ? [...(current.medium ?? []), ...(current.subject ?? [])] : [];
  const touchStart = useRef<number | null>(null);
  const [direction, setDirection] = useState(0);

  const canNav = items.length > 1;
  const prevItem = canNav ? items[wrap(index - 1, items.length)] : null;
  const nextItem = canNav ? items[wrap(index + 1, items.length)] : null;

  const goPrev = useCallback(() => {
    if (!canNav) return;
    setDirection(-1);
    onChange(wrap(index - 1, items.length));
  }, [index, items.length, canNav, onChange]);

  const goNext = useCallback(() => {
    if (!canNav) return;
    setDirection(1);
    onChange(wrap(index + 1, items.length));
  }, [index, items.length, canNav, onChange]);

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
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0.5, scale: 0.92 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0.5, scale: 0.92 }),
  };

  if (!isOpen || !current) return null;

  const btnClass = "w-10 h-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors";

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close — top right */}
      <div className="absolute top-4 right-4 z-20">
        <button onClick={onClose} className={btnClass} aria-label="Close">
          <FaTimes size={13} className="text-white/80" />
        </button>
      </div>

      {/* Main image area — takes all available space */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Peek: previous image */}
        {prevItem && (
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[8%] sm:w-[12%] h-[60%] z-10 flex items-center justify-start pl-2 cursor-pointer group"
            aria-label="Previous"
          >
            <img
              src={thumbnailUrl(prevItem.image)}
              alt=""
              className="h-full w-full object-cover rounded-sm opacity-25 group-hover:opacity-40 transition-opacity"
            />
          </button>
        )}

        {/* Current image */}
        <div className="relative z-10 px-[10%] sm:px-[14%] max-w-full">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.img
              key={current.slug}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              src={fullUrl(current.image)}
              alt={current.title}
              className="max-h-[70vh] max-w-full object-contain rounded-sm"
              style={{ viewTransitionName: `artwork-${current.slug}` }}
            />
          </AnimatePresence>
        </div>

        {/* Peek: next image */}
        {nextItem && (
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[8%] sm:w-[12%] h-[60%] z-10 flex items-center justify-end pr-2 cursor-pointer group"
            aria-label="Next"
          >
            <img
              src={thumbnailUrl(nextItem.image)}
              alt=""
              className="h-full w-full object-cover rounded-sm opacity-25 group-hover:opacity-40 transition-opacity"
            />
          </button>
        )}
      </div>

      {/* Bottom bar — controls + tags */}
      <div className="flex-shrink-0 px-4 pb-5 pt-3" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1400px] mx-auto flex items-center gap-4">
          {/* Nav controls — bottom left */}
          {canNav && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={goPrev} className={btnClass} aria-label="Previous">
                <FaChevronLeft size={12} className="text-white/80" />
              </button>
              <span className="text-white/40 text-xs tabular-nums font-medium min-w-[3rem] text-center">
                {index + 1} / {items.length}
              </span>
              <button onClick={goNext} className={btnClass} aria-label="Next">
                <FaChevronRight size={12} className="text-white/80" />
              </button>
            </div>
          )}

          {/* Tags */}
          <AnimatePresence mode="wait">
            {tags.length > 0 && (
              <motion.div
                key={current.slug + "-tags"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex gap-1.5 flex-wrap flex-1"
              >
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/55 border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
