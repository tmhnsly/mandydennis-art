import Lightbox, { type Slide } from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { fullUrl } from "../lib/content";
import type { Artwork } from "../types";

interface Props {
  items: Artwork[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function ArtworkLightbox({ items, index, onClose, onChange }: Props) {
  const slides: Slide[] = items.map((item) => ({
    src: fullUrl(item.image),
    alt: item.title,
    title: item.title,
    description: [
      item.description,
      [...(item.medium ?? []), ...(item.subject ?? [])].map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" · "),
    ]
      .filter(Boolean)
      .join("\n"),
  }));

  return (
    <Lightbox
      open={index >= 0}
      index={index}
      close={onClose}
      on={{ view: ({ index: i }) => onChange(i) }}
      slides={slides}
      plugins={[Captions]}
      captions={{ descriptionTextAlign: "center", descriptionMaxLines: 3 }}
      carousel={{ finite: items.length <= 1 }}
      animation={{ swipe: 200 }}
      controller={{ closeOnBackdropClick: true }}
      styles={{
        container: { backgroundColor: "rgba(0,0,0,0.94)" },
        captionsTitle: {
          fontFamily: "var(--font-display)",
          fontSize: "1.1rem",
          fontWeight: 600,
          letterSpacing: "-0.02em",
        },
        captionsTitleContainer: {
          background: "none",
          paddingBottom: 0,
        },
        captionsDescription: {
          fontFamily: "var(--font-body)",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "0.02em",
        },
        captionsDescriptionContainer: {
          background: "none",
          paddingTop: "0.35rem",
        },
        navigationPrev: {
          color: "rgba(255,255,255,0.6)",
        },
        navigationNext: {
          color: "rgba(255,255,255,0.6)",
        },
        button: {
          color: "rgba(255,255,255,0.6)",
          filter: "none",
        },
      }}
      render={{
        iconPrev: () => <span className="font-display text-2xl">‹</span>,
        iconNext: () => <span className="font-display text-2xl">›</span>,
        iconClose: () => <span className="font-display text-xl">✕</span>,
      }}
    />
  );
}
