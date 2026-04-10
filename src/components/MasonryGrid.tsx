import { useCallback, useRef } from "react";
import type { Artwork } from "../types";
import { thumbnailUrl } from "../lib/content";

interface Props {
  items: Artwork[];
  onSelect: (index: number, slug: string) => void;
  emptyMessage?: string;
}

export default function MasonryGrid({ items, onSelect, emptyMessage }: Props) {
  const prevItemsRef = useRef<string[]>([]);

  // Track which items are new (for staggered entrance)
  const prevSlugs = new Set(prevItemsRef.current);
  const isNew = useCallback((slug: string) => !prevSlugs.has(slug), [prevSlugs]);

  // Update ref after render
  prevItemsRef.current = items.map((i) => i.slug);

  if (items.length === 0) {
    return emptyMessage ? (
      <p className="text-text-muted text-center py-16">{emptyMessage}</p>
    ) : null;
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-[var(--gap-masonry)]">
      {items.map((item, i) => (
        <button
          key={item.slug}
          onClick={() => onSelect(i, item.slug)}
          className="block w-full break-inside-avoid mb-[var(--gap-masonry)] relative overflow-hidden cursor-pointer group text-left"
          style={{
            animation: isNew(item.slug) ? `gridFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${Math.min(i * 0.03, 0.3)}s both` : undefined,
          }}
        >
          <img
            src={thumbnailUrl(item.image)}
            alt={item.title}
            className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = "1"; }}
            style={{ opacity: 0, transition: "opacity 0.3s ease" }}
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
      ))}
    </div>
  );
}
