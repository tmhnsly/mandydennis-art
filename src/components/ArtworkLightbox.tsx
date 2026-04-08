import { useEffect, useCallback, useState, useRef } from "react";
import { motion, type PanInfo } from "motion/react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { fullUrl } from "../lib/content";
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
  const [imgLoaded, setImgLoaded] = useState(false);
  const dragX = useRef(0);

  const canNav = items.length > 1;

  const goPrev = useCallback(() => {
    if (!canNav) return;
    setImgLoaded(false);
    onChange(wrap(index - 1, items.length));
  }, [index, items.length, canNav, onChange]);

  const goNext = useCallback(() => {
    if (!canNav) return;
    setImgLoaded(false);
    onChange(wrap(index + 1, items.length));
  }, [index, items.length, canNav, onChange]);

  // Reset loaded state when opening
  useEffect(() => {
    if (isOpen) setImgLoaded(false);
  }, [isOpen]);

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
    if (Math.abs(info.offset.x) > 60) {
      info.offset.x > 0 ? goPrev() : goNext();
    }
  };

  if (!isOpen || !current) return null;

  const btnClass = "w-11 h-11 rounded-full backdrop-blur-md bg-white/8 hover:bg-white/15 border border-white/8 flex items-center justify-center transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[9999] bg-black/95"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className={`absolute top-3 right-3 z-20 ${btnClass}`}
        aria-label="Close"
      >
        <FaTimes size={13} className="text-white/70" />
      </button>

      {/* Full canvas image area — image can fill edge to edge */}
      <div className="absolute inset-0 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <motion.div
          key={current.slug}
          drag={canNav ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          onDrag={(_, info) => { dragX.current = info.offset.x; }}
          className="relative max-w-full max-h-full flex items-center justify-center cursor-grab active:cursor-grabbing p-2"
        >
          <img
            src={fullUrl(current.image)}
            alt={current.title}
            onLoad={() => setImgLoaded(true)}
            className={`max-w-full max-h-[100vh] object-contain select-none transition-opacity duration-200 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            draggable={false}
          />
        </motion.div>
      </div>

      {/* Bottom bar — floats above image with frosted background */}
      <div className="absolute bottom-0 left-0 right-0 z-20 backdrop-blur-md bg-black/40 border-t border-white/5" onClick={(e) => e.stopPropagation()}>
        <div className="max-w-[1400px] mx-auto flex items-center gap-4 px-4 py-3">
          {canNav && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button onClick={goPrev} className={btnClass} aria-label="Previous">
                <FaChevronLeft size={12} className="text-white/70" />
              </button>
              <span className="text-white/35 text-xs tabular-nums font-medium min-w-[3rem] text-center">
                {index + 1} / {items.length}
              </span>
              <button onClick={goNext} className={btnClass} aria-label="Next">
                <FaChevronRight size={12} className="text-white/70" />
              </button>
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap flex-1">
              {tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/50 border border-white/10 bg-white/5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
