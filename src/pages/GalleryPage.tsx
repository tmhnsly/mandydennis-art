import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getArtwork, getInitialArtwork } from "../lib/content";
import ArtworkLightbox from "../components/ArtworkLightbox";
import { useAnimateIn } from "../hooks/useAnimateIn";
import CtaBanner from "../components/CtaBanner";
import SectionHeader from "../components/SectionHeader";
import TagFilter from "../components/gallery/TagFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";
import type { Artwork } from "../types";
import DrawLine from "../components/DrawLine";

const PAGE_SIZE = 12;

// Priority tags shown first in the filter bar
const PRIORITY_TAGS = ["pets", "animals", "dogs", "cats", "horses", "birds", "wildlife"];

function getAllTags(items: Artwork[]): string[] {
  const tags = new Set<string>();
  for (const item of items) {
    item.medium.forEach((t) => tags.add(t));
    item.subject.forEach((t) => tags.add(t));
  }
  const sorted = Array.from(tags).sort();
  // Move priority tags to the front
  const priority = PRIORITY_TAGS.filter((t) => sorted.includes(t));
  const rest = sorted.filter((t) => !PRIORITY_TAGS.includes(t));
  return [...priority, ...rest];
}

function artworkTags(item: Artwork): string[] {
  return [...item.medium, ...item.subject];
}

export default function GalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allArtwork, setAllArtwork] = useState<Artwork[]>(getInitialArtwork);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [showCount, setShowCount] = useState(PAGE_SIZE);
  const { ref: bodyRef, isInView } = useAnimateIn();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Read tag + image from URL params
  const urlTag = searchParams.get("tag");
  const urlImage = searchParams.get("image");

  const [activeTags, setActiveTags] = useState<string[]>(() =>
    urlTag ? [urlTag] : []
  );
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => { document.title = "Gallery — Mandy Dennis Art"; }, []);
  useEffect(() => { getArtwork().then(setAllArtwork); }, []);

  // Apply tag from URL when it changes (e.g. from lightbox tag click)
  useEffect(() => {
    if (urlTag) {
      setActiveTags([urlTag]);
      setFeaturedOnly(false);
      setShowCount(PAGE_SIZE);
    }
  }, [urlTag]);

  // Open lightbox from URL param (e.g. shared link)
  useEffect(() => {
    if (urlImage && allArtwork.length > 0) {
      const idx = allArtwork.findIndex((a) => a.slug === urlImage);
      if (idx >= 0) {
        setShowCount(Math.max(PAGE_SIZE, idx + 1));
        setLightboxIndex(idx);
      }
    }
  }, [urlImage, allArtwork]);

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
    setActiveTags((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
      // Update URL to reflect tag state
      if (next.length === 1) {
        setSearchParams({ tag: next[0] }, { replace: true });
      } else {
        setSearchParams({}, { replace: true });
      }
      return next;
    });
    setShowCount(PAGE_SIZE);
  };

  const clearTags = () => {
    setActiveTags([]);
    setSearchParams({}, { replace: true });
    setShowCount(PAGE_SIZE);
  };

  // Update URL when lightbox opens/closes
  const openLightbox = (i: number) => {
    const item = visible[i];
    if (item) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("image", item.slug);
        return next;
      }, { replace: true });
    }
    setLightboxIndex(i);
  };

  const closeLightbox = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("image");
      return next;
    }, { replace: true });
    setLightboxIndex(-1);
  };

  const changeLightbox = (i: number) => {
    const item = visible[i];
    if (item) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("image", item.slug);
        return next;
      }, { replace: true });
    }
    setLightboxIndex(i);
  };

  // Infinite scroll
  const loadMore = useCallback(() => {
    if (hasMore) setShowCount((c) => c + PAGE_SIZE);
  }, [hasMore]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <div>
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
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
                  onClear={clearTags}
                  showFeatured
                  featuredActive={featuredOnly}
                  onToggleFeatured={() => { setFeaturedOnly((p) => !p); setShowCount(PAGE_SIZE); }}
                />

                <GalleryGrid
                  items={visible}
                  onSelect={openLightbox}
                />

                {hasMore && <div ref={loadMoreRef} className="h-1" />}
              </>
            )}
          </div>
        </div>

        <ArtworkLightbox
          items={visible}
          index={lightboxIndex}
          onClose={closeLightbox}
          onChange={changeLightbox}
          onTagClick={(tag) => { closeLightbox(); toggleTag(tag); }}
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
