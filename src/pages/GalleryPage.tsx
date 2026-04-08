import { useState, useEffect, useMemo } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getArtwork, getInitialArtwork, fullUrl } from "../lib/content";
import { useAnimateIn } from "../hooks/useAnimateIn";
import CtaBanner from "../components/CtaBanner";
import SectionHeader from "../components/SectionHeader";
import TagFilter from "../components/gallery/TagFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";
import type { Artwork } from "../types";
import DrawLine from "../components/DrawLine";

const PAGE_SIZE = 12;

function getAllTags(items: Artwork[]): string[] {
  const tags = new Set<string>();
  for (const item of items) {
    item.medium.forEach((t) => tags.add(t));
    item.subject.forEach((t) => tags.add(t));
  }
  return Array.from(tags).sort();
}

function artworkTags(item: Artwork): string[] {
  return [...item.medium, ...item.subject];
}

export default function GalleryPage() {
  const [allArtwork, setAllArtwork] = useState<Artwork[]>(getInitialArtwork);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [featuredOnly, setFeaturedOnly] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showCount, setShowCount] = useState(PAGE_SIZE);
  const { ref: bodyRef, isInView } = useAnimateIn();

  useEffect(() => { document.title = "Gallery — Mandy Dennis Art"; }, []);
  useEffect(() => { getArtwork().then(setAllArtwork); }, []);

  const filtered = useMemo(() => {
    let items = allArtwork;
    if (featuredOnly) items = items.filter((a) => a.featured);
    if (activeTags.length > 0) {
      items = items.filter((item) => {
        const tags = artworkTags(item);
        return activeTags.every((t) => tags.includes(t));
      });
    }
    return items;
  }, [activeTags, featuredOnly, allArtwork]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;
  const availableTags = useMemo(() => getAllTags(filtered), [filtered]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setShowCount(PAGE_SIZE);
  };

  const lightboxSlides = visible.map((item) => ({
    src: fullUrl(item.image),
    alt: item.title,
    title: item.title,
  }));

  return (
    <>
      <div>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
          <SectionHeader title="Gallery" />

          <div ref={bodyRef} className={`anim-fade-up ${isInView ? "in-view" : ""}`}>
            {allArtwork.length === 0 ? (
              <p className="text-text-muted py-8">
                Gallery coming soon. Check back for Mandy's latest work.
              </p>
            ) : (
              <>
                <TagFilter
                  availableTags={availableTags}
                  activeTags={activeTags}
                  onToggle={toggleTag}
                  onClear={() => { setActiveTags([]); setShowCount(PAGE_SIZE); }}
                  showFeatured
                  featuredActive={featuredOnly}
                  onToggleFeatured={() => { setFeaturedOnly((p) => !p); setShowCount(PAGE_SIZE); }}
                />

                <GalleryGrid
                  items={visible}
                  onSelect={(i) => setLightboxIndex(i)}
                />

                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowCount((c) => c + PAGE_SIZE)}
                      className="min-h-11 px-6 py-3 text-[0.8rem] font-medium tracking-wide uppercase border border-line-strong text-text-muted hover:border-text hover:text-text transition-colors"
                    >
                      Show more
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <Lightbox
          open={lightboxIndex >= 0}
          index={lightboxIndex}
          close={() => setLightboxIndex(-1)}
          slides={lightboxSlides}
          styles={{ container: { backgroundColor: "rgba(0,0,0,0.92)" } }}
          carousel={{ finite: false }}
          animation={{ swipe: 250 }}
        />
      </div>
      <DrawLine />

      <CtaBanner
        heading="Like what you see?"
        text="Commission your own portrait or get in touch to discuss an idea."
        buttonLabel="Get in Touch"
        buttonTo="/commissions"
        secondaryLabel="View Prices"
        secondaryTo="/commissions"
      />
      <DrawLine />
    </>
  );
}
