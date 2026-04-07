import { useEffect, useCallback, useRef, useState } from "react";
import { fullUrl } from "../../lib/cloudinary";
import type { Artwork } from "../../types";

interface Props {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function Lightbox({ items, index, onClose, onChange }: Props) {
  const touchStart = useRef<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const item = items[index];

  const goPrev = useCallback(() => {
    setImageLoaded(false);
    onChange(index === 0 ? items.length - 1 : index - 1);
  }, [index, items.length, onChange]);

  const goNext = useCallback(() => {
    setImageLoaded(false);
    onChange(index === items.length - 1 ? 0 : index + 1);
  }, [index, items.length, onChange]);

  useEffect(() => {
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
  }, [onClose, goPrev, goNext]);

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl z-10 w-11 h-11 flex items-center justify-center"
        aria-label="Close"
      >
        &times;
      </button>

      {/* Prev button */}
      <button
        onClick={(e) => { e.stopPropagation(); goPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 w-11 h-11 flex items-center justify-center"
        aria-label="Previous"
      >
        &#8249;
      </button>

      {/* Image + caption */}
      <div
        className="max-w-5xl max-h-[90vh] flex flex-col items-center px-12"
        onClick={(e) => e.stopPropagation()}
      >
        {!imageLoaded && (
          <div className="text-white/50 text-sm">Loading...</div>
        )}
        <img
          src={fullUrl(item.image)}
          alt={item.title}
          className={`max-h-[75vh] max-w-full object-contain rounded transition-opacity ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="mt-4 text-center">
          <h2 className="text-white font-display text-lg">{item.title}</h2>
          {item.description && (
            <p className="text-white/70 text-sm mt-1">{item.description}</p>
          )}
          <div className="flex gap-2 justify-center mt-2">
            {[...item.medium, ...item.subject].map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/60 capitalize"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={(e) => { e.stopPropagation(); goNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl z-10 w-11 h-11 flex items-center justify-center"
        aria-label="Next"
      >
        &#8250;
      </button>
    </div>
  );
}
