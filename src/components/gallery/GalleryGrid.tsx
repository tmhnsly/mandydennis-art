import type { Artwork } from "../../types";
import { thumbnailUrl } from "../../lib/content";

interface Props {
  items: Artwork[];
  onSelect: (index: number) => void;
}

export default function GalleryGrid({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-text-muted text-center py-16">
        No artwork matches the selected filters.
      </p>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-[3px]">
      {items.map((item, i) => (
        <button
          key={item.slug}
          onClick={() => onSelect(i)}
          className="block w-full break-inside-avoid mb-[3px] relative overflow-hidden cursor-pointer group text-left"
        >
          <img
            src={thumbnailUrl(item.image)}
            alt={item.title}
            className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,31,24,0.78)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350 flex flex-col justify-end p-4">
            <h3 className="font-display text-[0.95rem] font-semibold text-white tracking-tight mb-1">
              {item.title}
            </h3>
            <div className="flex gap-1.5 flex-wrap">
              {[...item.medium, ...item.subject].map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[0.6rem] tracking-wide uppercase text-white/65 border border-white/15 bg-white/5"
                >
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
