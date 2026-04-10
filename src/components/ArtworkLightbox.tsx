import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "motion/react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { fullUrl } from "../lib/content";
import type { Artwork } from "../types";

interface Props {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
  onTagClick?: (tag: string) => void;
}

export default function ArtworkLightbox({ items, index, onClose, onChange, onTagClick }: Props) {
  const isOpen = index >= 0;
  const current = isOpen && index < items.length ? items[index] : null;
  const tags = current ? [...(current.medium ?? []), ...(current.subject ?? [])] : [];
  const navigate = useNavigate();
  const canNav = items.length > 1;
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Stable key from item slugs — forces embla remount when items change
  const itemsKey = items.map((i) => i.slug).join(",");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canNav,
    startIndex: index >= 0 ? index : 0,
    duration: 20,
  });

  // Sync embla selection → parent
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const sel = emblaApi.selectedScrollSnap();
      if (sel !== index) onChange(sel);
    };
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, index, onChange]);

  // Sync parent → embla (button clicks, keyboard)
  useEffect(() => {
    if (!emblaApi || !isOpen) return;
    const snap = emblaApi.selectedScrollSnap();
    if (snap !== index && index >= 0) {
      emblaApi.scrollTo(index, false);
    }
  }, [emblaApi, index, isOpen]);

  const goPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keyboard nav
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    // Prevent scroll without removing scrollbar (avoids layout shift)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isOpen, onClose, goPrev, goNext]);

  // Swipe down to close — only if vertical movement dominates
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStart.current.x);
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    // Only close if mostly vertical (dy > dx) and downward > 120px
    if (dy > 120 && dy > dx * 2) onClose();
    touchStart.current = null;
  };

  const btnClass = "w-11 h-11 rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors";

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0 } }}
          role="dialog"
          aria-label="Image viewer"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 z-20 ${btnClass}`}
            aria-label="Close"
          >
            <FaTimes size={13} className="text-white/70" />
          </button>

          {/* Embla carousel — keyed by items so it remounts on filter change */}
          <div className="flex-1 overflow-hidden" ref={emblaRef} key={itemsKey}>
            <div className="flex h-full">
              {items.map((item) => (
                <div
                  key={item.slug}
                  className="flex-[0_0_100%] min-w-0 flex items-center justify-center p-3 sm:p-6"
                >
                  <img
                    src={fullUrl(item.image)}
                    alt={item.title}
                    className="max-w-full max-h-full object-contain select-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-[var(--width-content)] mx-auto flex items-end justify-between gap-3 px-4 py-4">
              {tags.length > 0 ? (
                <div className="flex gap-1.5 flex-wrap flex-1 pointer-events-auto">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        onClose();
                        if (onTagClick) onTagClick(tag);
                        else navigate(`/gallery?tag=${encodeURIComponent(tag)}`);
                      }}
                      className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/70 border border-white/10 bg-black/30 backdrop-blur-md hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              ) : <div />}
              {canNav && (
                <div className="flex items-center gap-1.5 flex-shrink-0 pointer-events-auto">
                  <button onClick={goPrev} className={btnClass} aria-label="Previous">
                    <FaChevronLeft size={12} className="text-white/70" />
                  </button>
                  <span className="text-white/60 text-xs tabular-nums font-medium min-w-[3rem] text-center px-2 py-1 rounded-full bg-black/30 backdrop-blur-md">
                    {index + 1} / {items.length}
                  </span>
                  <button onClick={goNext} className={btnClass} aria-label="Next">
                    <FaChevronRight size={12} className="text-white/70" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
