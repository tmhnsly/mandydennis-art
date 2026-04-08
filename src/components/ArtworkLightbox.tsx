import { useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "motion/react";
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

const SWIPE_THRESHOLD = 50;

export default function ArtworkLightbox({ items, index, onClose, onChange }: Props) {
  const isOpen = index >= 0;
  const current = isOpen && index < items.length ? items[index] : null;
  const tags = current ? [...(current.medium ?? []), ...(current.subject ?? [])] : [];
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

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    else if (info.offset.x < -SWIPE_THRESHOLD) goNext();
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  const btnClass = "w-10 h-10 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors";

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          onClick={onClose}
        >
          {/* Close */}
          <div className="absolute top-4 right-4 z-20">
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className={btnClass} aria-label="Close">
              <FaTimes size={13} className="text-white/80" />
            </button>
          </div>

          {/* Image area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Peek prev */}
            {prevItem && (
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[8%] sm:w-[12%] h-[60%] z-10 cursor-pointer group"
                aria-label="Previous"
              >
                <img src={thumbnailUrl(prevItem.image)} alt="" className="h-full w-full object-cover rounded-sm opacity-20 group-hover:opacity-35 transition-opacity" />
              </button>
            )}

            {/* Main image — draggable for swipe */}
            <div className="relative z-10 px-[10%] sm:px-[14%] max-w-full" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="popLayout" custom={direction} initial={false}>
                <motion.div
                  key={current.slug}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  drag={canNav ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.15}
                  onDragEnd={handleDragEnd}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <motion.img
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    src={fullUrl(current.image)}
                    alt={current.title}
                    className="max-h-[70vh] max-w-full object-contain rounded-sm select-none pointer-events-none"
                    draggable={false}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Peek next */}
            {nextItem && (
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-[8%] sm:w-[12%] h-[60%] z-10 cursor-pointer group"
                aria-label="Next"
              >
                <img src={thumbnailUrl(nextItem.image)} alt="" className="h-full w-full object-cover rounded-sm opacity-20 group-hover:opacity-35 transition-opacity" />
              </button>
            )}
          </div>

          {/* Bottom bar */}
          <div className="flex-shrink-0 px-4 pb-5 pt-3" onClick={(e) => e.stopPropagation()}>
            <div className="max-w-[1400px] mx-auto flex items-center gap-4">
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
                      <span key={tag} className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/55 border border-white/10 bg-white/5 backdrop-blur-sm">
                        {tag}
                      </span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
