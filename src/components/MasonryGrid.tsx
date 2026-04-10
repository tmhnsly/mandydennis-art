import { useRef, useState, useCallback } from "react";
import type { Artwork } from "../types";
import { thumbnailUrl } from "../lib/content";

interface Props {
  items: Artwork[];
  onSelect: (index: number, slug: string) => void;
  emptyMessage?: string;
}

export default function MasonryGrid({ items, onSelect, emptyMessage }: Props) {
  // Track which slugs have already played their entrance animation
  const animatedSlugs = useRef(new Set<string>());
  // Track which images have loaded for fade-in
  const [loadedSlugs, setLoadedSlugs] = useState(new Set<string>());

  const onImageLoad = useCallback((slug: string) => {
    setLoadedSlugs((prev) => {
      if (prev.has(slug)) return prev;
      const next = new Set(prev);
      next.add(slug);
      return next;
    });
  }, []);

  if (items.length === 0) {
    return emptyMessage ? (
      <p className="text-text-muted text-center py-16">{emptyMessage}</p>
    ) : null;
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-[var(--gap-masonry)]">
      {items.map((item, i) => {
        const shouldAnimate = !animatedSlugs.current.has(item.slug);
        if (shouldAnimate) animatedSlugs.current.add(item.slug);
        const isLoaded = loadedSlugs.has(item.slug);

        return (
          <button
            key={item.slug}
            onClick={() => onSelect(i, item.slug)}
            className="block w-full break-inside-avoid mb-[var(--gap-masonry)] relative overflow-hidden cursor-pointer group text-left"
            style={shouldAnimate ? {
              animation: `gridFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 0.03, 0.3)}s both`,
            } : undefined}
          >
            <img
              src={thumbnailUrl(item.image)}
              alt={item.title}
              className={`w-full h-auto block transition-opacity duration-300 ease-out group-hover:scale-[1.02] transition-transform duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
              loading="lazy"
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
  );
}
