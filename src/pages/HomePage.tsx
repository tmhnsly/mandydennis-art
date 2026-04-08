import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { getArtwork, getInitialArtwork, thumbnailUrl } from "../lib/content";
import CtaBanner from "../components/CtaBanner";
import ArtworkLightbox from "../components/ArtworkLightbox";
import { useSiteSettings } from "../context/SiteSettings";
import { useInView } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import FeaturedGrid from "../components/FeaturedGrid";
import DrawLine from "../components/DrawLine";
import TextReveal from "../components/TextReveal";
import type { Artwork } from "../types";

const CYCLE_MS = 5000;

export default function HomePage() {
  const settings = useSiteSettings();
  const initial = getInitialArtwork();
  const [featured, setFeatured] = useState<Artwork[]>(() => initial.filter((a) => a.featured));
  const [allArtwork, setAllArtwork] = useState<Artwork[]>(initial);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroFading, setHeroFading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const { ref: featuredRef, isInView: featuredInView } = useInView(0.1);

  useEffect(() => { document.title = "Mandy Dennis Art"; }, []);

  useEffect(() => {
    getArtwork().then((all) => {
      setAllArtwork(all);
      setFeatured(all.filter((a) => a.featured));
    });
  }, []);

  // Cycle hero image
  const cycleHero = useCallback(() => {
    if (featured.length <= 1) return;
    setHeroFading(true);
    const fadeTimer = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // After fade out starts, wait for transition then swap
        const swapTimer = window.setTimeout(() => {
          setHeroIndex((i) => (i + 1) % featured.length);
          setHeroFading(false);
        }, 400);
        return () => clearTimeout(swapTimer);
      });
    });
    return () => cancelAnimationFrame(fadeTimer);
  }, [featured.length]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(cycleHero, CYCLE_MS);
    return () => clearInterval(interval);
  }, [featured.length, cycleHero]);

  const heroImage = featured.length > 0 ? featured[heroIndex % featured.length] : allArtwork[0];
  // Featured grid shows all except the current hero image
  const gridItems = featured.filter((_, i) => i !== heroIndex % featured.length);

  return (
    <>
      {/* Hero — full-width image with overlaid text */}
      <div className="relative overflow-hidden">
        {/* Background image */}
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={thumbnailUrl(heroImage.image)}
              alt=""
              loading="eager"
              fetchPriority="high"
              className={`w-full h-full object-cover transition-opacity duration-500 ${heroFading ? "opacity-0" : "opacity-100"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/95 via-bg/80 to-bg/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,8vw,7rem)]">
          <div className="hero-stagger max-w-xl">
            <h1 className="font-display text-[clamp(3.5rem,9vw,6rem)] font-bold tracking-[-0.04em] leading-[0.88] mb-5">
              <TextReveal as="span" className="block">Mandy</TextReveal>
              <TextReveal as="span" delay={0.08} className="block font-serif italic font-normal text-text-mid">Dennis</TextReveal>
            </h1>
            <p className="text-[1.1rem] text-text-mid leading-relaxed max-w-[440px] mb-8">
              {settings.tagline || "Pet portraiture, wildlife, seascapes & still life — predominantly in soft pastels and watercolours."}
            </p>
            <div className="flex gap-2.5 flex-wrap mb-10">
              <Link to="/gallery" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity">
                View Gallery
              </Link>
              <Link to="/commissions" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors">
                Commissions
              </Link>
            </div>
            <div className="flex gap-[clamp(1.5rem,4vw,3rem)] pt-5 border-t border-line flex-wrap">
              <div>
                <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Medium</div>
                <div className="font-display text-[0.85rem] font-semibold tracking-tight">Pastels & Watercolours</div>
              </div>
              <div>
                <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Subjects</div>
                <div className="font-display text-[0.85rem] font-semibold tracking-tight">Pets · Wildlife · Seascapes</div>
              </div>
            </div>
          </div>

          {/* Cycle indicators */}
          {featured.length > 1 && (
            <div className="flex gap-1.5 mt-8">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setHeroIndex(i); setHeroFading(false); }}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === heroIndex % featured.length
                      ? "w-6 bg-text/60"
                      : "w-1.5 bg-text/20 hover:bg-text/30"
                  }`}
                  aria-label={`Show artwork ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <DrawLine />

      {/* Featured Work — excludes current hero image */}
      {gridItems.length > 0 && (
        <>
          <div ref={featuredRef}>
            <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
              <SectionHeader title="Featured Work" />
              <div className={`anim-fade-up ${featuredInView ? "in-view" : ""}`}>
                <FeaturedGrid items={gridItems} onSelect={(i) => setLightboxIndex(i)} />
                <div className="mt-8 text-center">
                  <Link to="/gallery" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors">
                    <FaArrowRight size={14} />
                    Browse all work
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <DrawLine />

          <ArtworkLightbox
            items={gridItems}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
            onChange={setLightboxIndex}
          />
        </>
      )}

      <CtaBanner
        heading="Ready to commission?"
        text="Get a unique piece of art created just for you. Pastels, watercolours, pet portraits and more."
        buttonLabel="Get in Touch"
        buttonTo="/commissions"
        secondaryLabel="View Prices"
        secondaryTo="/commissions"
      />
      <DrawLine />
    </>
  );
}
