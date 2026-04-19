import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import type { Artwork } from "../types";
import { thumbnailUrl, imageDimensions } from "../lib/content";

interface Props {
  items: Artwork[];
  onSelect: (index: number, slug: string) => void;
  emptyMessage?: string;
}

/** Returns responsive column count matching Tailwind breakpoints: 1 / 2 / 3 */
function useColumnCount() {
  const [cols, setCols] = useState(() => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  });

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");
    const update = () => setCols(lg.matches ? 3 : sm.matches ? 2 : 1);
    lg.addEventListener("change", update);
    sm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      sm.removeEventListener("change", update);
    };
  }, []);

  return cols;
}

export default function MasonryGrid({ items, onSelect, emptyMessage }: Props) {
  const cols = useColumnCount();
  const animatedSlugs = useRef(new Set<string>());
  const [loadedSlugs, setLoadedSlugs] = useState(new Set<string>());

  const onImageLoad = useCallback((slug: string) => {
    setLoadedSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  }, []);

  // Distribute items round-robin across columns (left-to-right, row by row)
  const columns = useMemo(() => {
    const result: { item: Artwork; index: number }[][] = Array.from({ length: cols }, () => []);
    items.forEach((item, i) => {
      result[i % cols].push({ item, index: i });
    });
    return result;
  }, [items, cols]);

  if (items.length === 0) {
    return emptyMessage ? (
      <p className="text-text-muted text-center py-16">{emptyMessage}</p>
    ) : null;
  }

  return (
    <div className="flex gap-[var(--gap-masonry)] items-start">
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex-1 min-w-0 flex flex-col gap-[var(--gap-masonry)]">
          {col.map(({ item, index }) => {
            const shouldAnimate = !animatedSlugs.current.has(item.slug);
            if (shouldAnimate) animatedSlugs.current.add(item.slug);
            const isLoaded = loadedSlugs.has(item.slug);
            const dims = imageDimensions(item.image);
            const ratio = dims ? `${dims.width} / ${dims.height}` : "4 / 3";

            return (
              <button
                key={item.slug}
                onClick={() => onSelect(index, item.slug)}
                className="block w-full relative overflow-hidden cursor-pointer group text-left bg-surface"
                style={{
                  aspectRatio: ratio,
                  contain: "content",
                  ...(shouldAnimate ? {
                    animation: `gridFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(index * 0.03, 0.3)}s both`,
                  } : undefined),
                }}
              >
                <img
                  src={thumbnailUrl(item.image)}
                  alt={item.title}
                  width={dims?.width}
                  height={dims?.height}
                  className={`w-full h-auto block transition-opacity duration-300 ease-out ${isLoaded ? "opacity-100" : "opacity-0"}`}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => onImageLoad(item.slug)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,31,24,0.8)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-4">
                  <h3 className="font-display text-[0.95rem] font-semibold text-white tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <div className="flex gap-1.5 flex-wrap">
                    {[...(item.medium ?? []), ...(item.subject ?? [])].map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-[0.6rem] tracking-wide uppercase text-white/65 border border-white/15 bg-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="absolute top-3 right-3 text-white text-sm opacity-0 group-hover:opacity-60 transition-opacity font-display">
                  ↗
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
