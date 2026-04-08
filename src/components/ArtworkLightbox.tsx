import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
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

  const slides = items.map((item) => ({
    src: fullUrl(item.image),
    alt: item.title,
  }));

  return (
    <>
      <Lightbox
        open={isOpen}
        index={index}
        close={onClose}
        on={{ view: ({ index: i }) => onChange(i) }}
        slides={slides}
        carousel={{ finite: items.length <= 1 }}
        animation={{ swipe: 200 }}
        controller={{ closeOnBackdropClick: true }}
        styles={{
          container: { backgroundColor: "rgba(0,0,0,0.95)" },
          button: { filter: "none" },
          slide: { padding: "3rem 0.5rem 4rem" },
          navigationPrev: { display: items.length <= 1 ? "none" : undefined },
          navigationNext: { display: items.length <= 1 ? "none" : undefined },
        }}
        render={{
          iconPrev: () => (
            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <FaChevronLeft size={14} className="text-white/80" />
            </div>
          ),
          iconNext: () => (
            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <FaChevronRight size={14} className="text-white/80" />
            </div>
          ),
          iconClose: () => (
            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <FaTimes size={14} className="text-white/80" />
            </div>
          ),
        }}
      />

      {/* Tags overlay — positioned outside the lightbox slide container */}
      {isOpen && tags.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-[10001] flex justify-center gap-1.5 pb-4 pt-2 px-4 flex-wrap pointer-events-none">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-[0.6rem] tracking-wide uppercase text-white/55 border border-white/10 bg-black/30 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}
