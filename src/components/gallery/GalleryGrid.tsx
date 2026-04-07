import type { Artwork } from "../../types";
import { thumbnailUrl } from "../../lib/content";

interface Props {
  items: Artwork[];
  onSelect: (index: number) => void;
}

export default function GalleryGrid({ items, onSelect }: Props) {
  if (items.length === 0) {
    return (
      <p className="text-warm-500 text-center py-12">
        No artwork matches the selected filters.
      </p>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
      {items.map((item, i) => (
        <button
          key={item.slug}
          onClick={() => onSelect(i)}
          className="block w-full break-inside-avoid rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer bg-white"
        >
          <img
            src={thumbnailUrl(item.image)}
            alt={item.title}
            className="w-full h-auto block group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
          <div className="p-3">
            <h3 className="font-display text-sm text-warm-800">{item.title}</h3>
          </div>
        </button>
      ))}
    </div>
  );
}
