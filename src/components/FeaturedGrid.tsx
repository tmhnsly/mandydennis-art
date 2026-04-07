import { Link } from "react-router-dom";
import type { Artwork } from "../types";
import { thumbnailUrl } from "../lib/content";

interface Props {
  items: Artwork[];
}

export default function FeaturedGrid({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => (
        <Link
          key={item.slug}
          to="/gallery"
          className="block rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group bg-white"
        >
          <img
            src={thumbnailUrl(item.image)}
            alt={item.title}
            className="w-full h-64 object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
          <div className="p-3">
            <h3 className="font-display text-sm text-warm-800">{item.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
