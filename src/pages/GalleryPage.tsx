import { useState, useMemo } from "react";
import { getArtwork } from "../lib/content";
import TagFilter from "../components/gallery/TagFilter";
import GalleryGrid from "../components/gallery/GalleryGrid";
import Lightbox from "../components/gallery/Lightbox";
import type { Artwork } from "../types";

const allArtwork = getArtwork();

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
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (activeTags.length === 0) return allArtwork;
    return allArtwork.filter((item) => {
      const tags = artworkTags(item);
      return activeTags.every((t) => tags.includes(t));
    });
  }, [activeTags]);

  const availableTags = useMemo(() => {
    return getAllTags(filtered);
  }, [filtered]);

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        Gallery
      </h1>

      <div className="mb-8">
        <TagFilter
          availableTags={availableTags}
          activeTags={activeTags}
          onToggle={toggleTag}
          onClear={() => setActiveTags([])}
        />
      </div>

      <GalleryGrid
        items={filtered}
        onSelect={(i) => setLightboxIndex(i)}
      />

      {lightboxIndex !== null && (
        <Lightbox
          items={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
