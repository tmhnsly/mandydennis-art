import { useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "motion/react";
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
  const navigate = useNavigate();
  const canNav = items.length > 1;
  const closeThreshold = 120;

  // Vertical drag to dismiss
  const dragY = useMotionValue(0);
  const backdropOpacity = useTransform(dragY, [0, closeThreshold * 2], [0.95, 0]);
  const dragScale = useTransform(dragY, [0, closeThreshold * 2], [1, 0.85]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canNav,
    startIndex: index >= 0 ? index : 0,
    dragFree: false,
    containScroll: false,
    duration: 20,
    skipSnaps: false,
  });

  // Prevent embla from capturing vertical drags
  const slideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const selected = emblaApi.selectedScrollSnap();
      if (selected !== index) onChange(selected);
    };
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, index, onChange]);

  useEffect(() => {
    if (!emblaApi || !isOpen) return;
    if (emblaApi.selectedScrollSnap() !== index) {
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, index, isOpen]);

  useEffect(() => {
    if (!emblaApi || !isOpen) return;
    emblaApi.reInit({ startIndex: index >= 0 ? index : 0 });
  }, [emblaApi, isOpen]);

  const goPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const goNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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

  // Reset drag when closing
  useEffect(() => {
    if (!isOpen) {
      dragY.set(0);
    }
  }, [isOpen, dragY]);

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
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ backgroundColor: useTransform(backdropOpacity, (v) => `rgba(0,0,0,${v})`) }}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 z-20 ${btnClass}`}
            aria-label="Close"
          >
            <FaTimes size={13} className="text-white/70" />
          </button>

          {/* Carousel with vertical drag wrapper */}
          <motion.div
            className="flex-1 overflow-hidden"
            style={{ y: dragY, scale: dragScale }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.4 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > closeThreshold || info.velocity.y > 500) {
                onClose();
              } else {
                dragY.set(0);
              }
            }}
          >
            <div className="h-full overflow-hidden" ref={emblaRef} style={{ touchAction: "none" }}>
              <div className="flex h-full">
                {items.map((item) => (
                  <div
                    key={item.slug}
                    ref={slideRef}
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
          </motion.div>

          {/* Click backdrop (above/below image) to close */}

          {/* Bottom bar — tags left, controls right */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="max-w-[var(--width-content)] mx-auto flex items-end justify-between gap-3 px-4 py-4">
              {tags.length > 0 ? (
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1 min-w-0">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { onClose(); navigate(`/gallery?tag=${encodeURIComponent(tag)}`); }}
                      className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/70 border border-white/10 bg-black/30 backdrop-blur-md hover:bg-white/15 hover:text-white transition-colors cursor-pointer whitespace-nowrap flex-shrink-0"
                    >
                      {tag}
                    </button>
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
