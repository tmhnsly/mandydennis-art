import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getArtwork, getInitialArtwork } from "../lib/content";
import ArtworkLightbox from "../components/ArtworkLightbox";
import { scrollToTop } from "../components/PageTransition";
import { useAnimateIn } from "../hooks/useAnimateIn";
import CtaBanner, { CtaAccent } from "../components/CtaBanner";
import SectionHeader from "../components/SectionHeader";
import TagFilter from "../components/gallery/TagFilter";
import MasonryGrid from "../components/MasonryGrid";
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
  const [lightboxSlug, setLightboxSlug] = useState<string | null>(null);
  const [showCount, setShowCount] = useState(PAGE_SIZE);
  const { ref: bodyRef, isInView } = useAnimateIn(0);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Read tag from URL
  const urlTag = searchParams.get("tag");

  const [activeTags, setActiveTags] = useState<string[]>(() =>
    urlTag ? [urlTag] : []
  );
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => { document.title = "Gallery — Mandy Dennis Art"; }, []);
  useEffect(() => { getArtwork().then(setAllArtwork); }, []);

  // Apply tag from URL when it changes
  useEffect(() => {
    if (urlTag) {
      setActiveTags([urlTag]);
      setFeaturedOnly(false);
      setShowCount(PAGE_SIZE);
    }
  }, [urlTag]);

  const filtered = useMemo(() => {
    let items = allArtwork;
    if (featuredOnly) items = items.filter((a) => a.featured);
    if (activeTags.length > 0) {
      items = items.filter((item) => {
        const tags = artworkTags(item);
        return activeTags.every((t) => tags.includes(t));
      });
    } else {
      // No tags selected: boost dogs/pets to the top for the initial view
      const DOG_PET_TAGS = ["dogs", "pets"];
      items = [...items].sort((a, b) => {
        const aScore = a.subject.some((s) => DOG_PET_TAGS.includes(s)) ? 0 : 1;
        const bScore = b.subject.some((s) => DOG_PET_TAGS.includes(s)) ? 0 : 1;
        return aScore - bScore;
      });
    }
    return items;
  }, [activeTags, featuredOnly, allArtwork]);

  const visible = filtered.slice(0, showCount);
  const hasMore = showCount < filtered.length;
  const availableTags = useMemo(() => getAllTags(filtered), [filtered]);

  // Resolve lightbox index from slug
  const lightboxIndex = lightboxSlug ? visible.findIndex((v) => v.slug === lightboxSlug) : -1;

  const toggleTag = (tag: string) => {
    setActiveTags((prev) => {
      const next = prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag];
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

  const openLightbox = (_i: number, slug?: string) => {
    setLightboxSlug(slug ?? visible[_i]?.slug ?? null);
  };

  const closeLightbox = () => {
    setLightboxSlug(null);
  };

  const changeLightbox = (newIndex: number) => {
    const item = visible[newIndex];
    if (item) setLightboxSlug(item.slug);
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

                <MasonryGrid
                  items={visible}
                  onSelect={openLightbox}
                  emptyMessage="No artwork matches the selected filters."
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
          onTagClick={(tag) => {
            closeLightbox();
            setActiveTags([tag]);
            setFeaturedOnly(false);
            setSearchParams({ tag }, { replace: true });
            setShowCount(PAGE_SIZE);
            scrollToTop();
          }}
        />
      </div>
      <DrawLine />

      <CtaBanner
        heading={<>Like <CtaAccent>what you see?</CtaAccent></>}
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
