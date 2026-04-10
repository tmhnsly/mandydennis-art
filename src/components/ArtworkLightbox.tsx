import { useEffect, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const backdropRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);
  const [loadedUrls, setLoadedUrls] = useState(new Set<string>());

  // Swipe-down refs — direct DOM for 60fps
  const touchRef = useRef<{ x: number; y: number; locked: "v" | "h" | null }>({ x: 0, y: 0, locked: null });
  const dragging = useRef(false);
  const closing = useRef(false);

  const onImageLoad = useCallback((url: string) => {
    setLoadedUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  // Scroll to the correct slide when index changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isOpen) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }, [index, isOpen]);

  // Scroll to initial position when opening
  useEffect(() => {
    if (!isOpen) return;
    closing.current = false;
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
    onChange(index === 0 ? items.length - 1 : index - 1);
  }, [index, items.length, canNav, onChange]);

  const goNext = useCallback(() => {
    if (!canNav) return;
    onChange(index === items.length - 1 ? 0 : index + 1);
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

  // iOS-style swipe-down-to-close — direct DOM manipulation for 60fps
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (closing.current) return;
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, locked: null };
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (closing.current) return;
    const t = touchRef.current;
    const dx = e.touches[0].clientX - t.x;
    const dy = e.touches[0].clientY - t.y;

    if (!t.locked) {
      if (Math.abs(dy) > 8 || Math.abs(dx) > 8) {
        t.locked = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
      }
      return;
    }

    if (t.locked !== "v" || dy <= 0) return;

    dragging.current = true;
    const carousel = carouselRef.current;
    const backdrop = backdropRef.current;
    if (!carousel || !backdrop) return;

    const progress = Math.min(dy / 300, 1);
    const scale = 1 - progress * 0.15;
    carousel.style.transform = `translateY(${dy}px) scale(${scale})`;
    carousel.style.transition = "none";
    backdrop.style.backgroundColor = `rgba(0,0,0,${0.95 - progress * 0.7})`;
    backdrop.style.transition = "none";
  }, []);

  const handleTouchEnd = useCallback(() => {
    const t = touchRef.current;
    const dy = dragging.current ? (() => {
      const carousel = carouselRef.current;
      if (!carousel) return 0;
      const match = carousel.style.transform.match(/translateY\((\d+(?:\.\d+)?)px\)/);
      return match ? parseFloat(match[1]) : 0;
    })() : 0;

    if (dragging.current && dy > 100) {
      // Commit close — animate image off screen
      closing.current = true;
      const carousel = carouselRef.current;
      const backdrop = backdropRef.current;
      if (carousel && backdrop) {
        carousel.style.transition = "transform 0.2s ease-out";
        carousel.style.transform = `translateY(${window.innerHeight}px) scale(0.8)`;
        backdrop.style.transition = "background-color 0.2s ease-out";
        backdrop.style.backgroundColor = "rgba(0,0,0,0)";
        setTimeout(onClose, 200);
      }
    } else if (dragging.current) {
      // Spring back
      const carousel = carouselRef.current;
      const backdrop = backdropRef.current;
      if (carousel && backdrop) {
        carousel.style.transition = "transform 0.3s cubic-bezier(0.2, 0.9, 0.3, 1)";
        carousel.style.transform = "";
        backdrop.style.transition = "background-color 0.3s ease-out";
        backdrop.style.backgroundColor = "";
      }
    }

    dragging.current = false;
    touchRef.current = { x: 0, y: 0, locked: null };
  }, [onClose]);

  const btnClass = "min-w-[44px] min-h-[44px] rounded-full backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors";

  if (!isOpen || !current) return null;

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-label="Image viewer"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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

      {/* Scroll-snap carousel */}
      <div
        ref={(el) => { scrollRef.current = el; carouselRef.current = el; }}
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

      {/* Bottom bar — tags grow upward, nav pinned right */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none">
        <div className="max-w-[var(--width-content)] mx-auto flex items-end justify-between gap-3 px-4 py-4">
          {tags.length > 0 ? (
            <div className="flex gap-1.5 flex-wrap-reverse content-end flex-1 pointer-events-auto">
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
    </div>
  );
}
