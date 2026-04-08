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
  const current = index >= 0 && index < items.length ? items[index] : null;
  const tags = current ? [...(current.medium ?? []), ...(current.subject ?? [])] : [];

  const slides = items.map((item) => ({
    src: fullUrl(item.image),
    alt: item.title,
  }));

  return (
    <>
      <Lightbox
        open={index >= 0}
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
          slideFooter: () =>
            tags.length > 0 ? (
              <div className="flex justify-center gap-1.5 pb-6 pt-3 flex-wrap px-4">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[0.65rem] tracking-wide uppercase text-white/60 border border-white/15 bg-white/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null,
        }}
      />
    </>
  );
}
