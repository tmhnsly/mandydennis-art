import { useEffect, useCallback } from "react";
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
}

export default function ArtworkLightbox({ items, index, onClose, onChange }: Props) {
  const isOpen = index >= 0;
  const current = isOpen && index < items.length ? items[index] : null;
  const tags = current ? [...(current.medium ?? []), ...(current.subject ?? [])] : [];
  const canNav = items.length > 1;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canNav,
    startIndex: index >= 0 ? index : 0,
    dragFree: false,
    containScroll: false,
    duration: 25,
    skipSnaps: false,
  });

  // Sync embla → parent state
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      if (selected !== index) onChange(selected);
    };
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, index, onChange]);

  // Sync parent state → embla (for button clicks)
  useEffect(() => {
    if (!emblaApi || !isOpen) return;
    if (emblaApi.selectedScrollSnap() !== index) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, index, isOpen]);

  // Re-init embla when opening with a new starting index
  useEffect(() => {
    if (!emblaApi || !isOpen) return;
    emblaApi.reInit({ startIndex: index >= 0 ? index : 0 });
  }, [emblaApi, isOpen]);

  const goPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Keyboard
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

  const btnClass = "w-11 h-11 rounded-full backdrop-blur-md bg-white/8 hover:bg-white/15 border border-white/8 flex items-center justify-center transition-colors";

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          key="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 z-20 ${btnClass}`}
            aria-label="Close"
          >
            <FaTimes size={13} className="text-white/70" />
          </button>

          {/* Carousel */}
          <div className="flex-1 overflow-hidden" ref={emblaRef}>
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

          {/* Click-to-close zones on either side of image */}
          <div className="absolute inset-y-0 left-0 w-12 z-10 cursor-pointer" onClick={onClose} />
          <div className="absolute inset-y-0 right-0 w-12 z-10 cursor-pointer" onClick={onClose} />

          {/* Bottom controls */}
          {/* Bottom bar — tags left, controls right */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3 px-4 py-4">
              {tags.length > 0 ? (
                <div className="flex gap-1.5 flex-wrap flex-1">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/70 border border-white/10 bg-black/30 backdrop-blur-md">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : <div />}
              {canNav && (
                <div className="flex items-center gap-1.5 flex-shrink-0">
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
