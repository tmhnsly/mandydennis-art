import { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [loadedUrls, setLoadedUrls] = useState(new Set<string>());

  // Track loaded images for spinner
  const onImageLoad = useCallback((url: string) => {
    setLoadedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  // Scroll to the correct slide when index changes (from buttons/keyboard)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }, [index, isOpen]);

  // Scroll to initial position when opening (instant, no animation)
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      const slide = el.children[index] as HTMLElement | undefined;
      if (slide) {
        slide.scrollIntoView({ behavior: "instant", inline: "start", block: "nearest" });
      }
    });
  }, [isOpen]);

  // Detect which slide is visible after scroll settles
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const detectSlide = () => {
      isScrolling.current = false;
      const newIndex = Math.round(el.scrollLeft / el.clientWidth);
      if (newIndex !== index && newIndex >= 0 && newIndex < items.length) {
        onChange(newIndex);
      }
    };

    if ("onscrollend" in window) {
      el.addEventListener("scrollend", detectSlide);
      return () => el.removeEventListener("scrollend", detectSlide);
    }

    let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      isScrolling.current = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(detectSlide, 80);
    };
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => { el.removeEventListener("scroll", handleScroll); clearTimeout(scrollTimer); };
  }, [index, items.length, onChange]);

  const goPrev = useCallback(() => {
    if (!canNav) return;
    const prev = index === 0 ? items.length - 1 : index - 1;
    onChange(prev);
  }, [index, items.length, canNav, onChange]);

  const goNext = useCallback(() => {
    if (!canNav) return;
    const next = index === items.length - 1 ? 0 : index + 1;
    onChange(next);
  }, [index, items.length, canNav, onChange]);

  // Keyboard
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [isOpen, onClose, goPrev, goNext]);

  // Swipe down to close — only triggers on vertical swipe, not horizontal scroll
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStart.current.x);
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    // Must be clearly vertical (down > 80px, ratio 3:1 vertical to horizontal)
    if (dy > 80 && dy > dx * 3) onClose();
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

          {/* Native scroll-snap carousel */}
          <div
            ref={scrollRef}
            className="flex-1 flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {items.map((item) => {
              const url = fullUrl(item.image);
              const isLoaded = loadedUrls.has(url);
              return (
                <div
                  key={item.slug}
                  className="flex-[0_0_100%] min-w-0 snap-center flex items-center justify-center p-3 sm:p-6 relative"
                >
                  {/* Loading spinner */}
                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    </div>
                  )}
                  <img
                    src={url}
                    alt={item.title}
                    loading="eager"
                    decoding="async"
                    onLoad={() => onImageLoad(url)}
                    className={`max-w-full max-h-full object-contain select-none transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                    draggable={false}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom bar — tags left-aligned, nav right-aligned */}
          <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
            <div className="max-w-[var(--width-content)] mx-auto flex items-end justify-between gap-3 px-4 py-4">
              {tags.length > 0 ? (
                <div className="flex gap-1.5 flex-wrap items-end flex-1 pointer-events-auto">
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
                  <button onClick={(e) => { e.stopPropagation(); goPrev(); }} className={btnClass} aria-label="Previous">
                    <FaChevronLeft size={12} className="text-white/70" />
                  </button>
                  <span className="text-white/60 text-xs tabular-nums font-medium min-w-[3rem] text-center px-2 py-1 rounded-full bg-black/30 backdrop-blur-md">
                    {index + 1} / {items.length}
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); goNext(); }} className={btnClass} aria-label="Next">
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
