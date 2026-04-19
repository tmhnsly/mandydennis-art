import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaInstagram, FaEnvelope } from "react-icons/fa";
import { getArtwork, getInitialArtwork, getEvents, getInitialEvents, heroUrl, hasFreshCache, imageDimensions } from "../lib/content";
import CtaBanner, { CtaAccent } from "../components/CtaBanner";
import ArtworkLightbox from "../components/ArtworkLightbox";
import EventCard from "../components/EventCard";
import { useSiteSettings } from "../context/SiteSettings";
import { useInView } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import MasonryGrid from "../components/MasonryGrid";
import DrawLine from "../components/DrawLine";
import TextReveal from "../components/TextReveal";
import type { Artwork, ArtEvent } from "../types";

const CYCLE_MS = 5000;

export default function HomePage() {
  const settings = useSiteSettings();
  const initial = getInitialArtwork();
  const [featured, setFeatured] = useState<Artwork[]>(() => initial.filter((a) => a.featured));
  const [events, setEvents] = useState<ArtEvent[]>(getInitialEvents);
  const [heroIndex, setHeroIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [heroReady, setHeroReady] = useState(() => {
    // If the first hero image is already in browser cache, show immediately (no fade)
    const first = initial.filter((a) => a.featured).find((a) => a.image);
    if (!first) return true;
    const img = new Image();
    img.src = heroUrl(first.image);
    return img.complete;
  });
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxImgs = useRef<HTMLElement[]>([]);
  const prevHeroIndex = useRef(0);
  const [instantSwitch, setInstantSwitch] = useState(false);
  const lightboxOpen = useRef(false);
  const { ref: featuredRef, isInView: featuredInView } = useInView(0.1);
  const { ref: introRef, isInView: introInView } = useInView(0.1);
  const { ref: eventsRef, isInView: eventsInView } = useInView(0.1);

  lightboxOpen.current = lightboxIndex >= 0;

  // Parallax — avoids getBoundingClientRect() which forces synchronous layout
  // reflow in Chrome on every scroll frame (the main perf killer).
  // window.scrollY is free and hero height is cached on resize.
  useEffect(() => {
    let rafId = 0;
    let heroHeight = heroRef.current?.offsetHeight ?? 0;

    const cacheHeight = () => {
      heroHeight = heroRef.current?.offsetHeight ?? 0;
    };

    const update = () => {
      const scrollY = window.scrollY;
      if (scrollY < heroHeight) {
        const y = scrollY * 0.10;
        for (const img of parallaxImgs.current) {
          if (img) img.style.transform = `scale(1.12) translate3d(0, ${y}px, 0)`;
        }
      }
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    cacheHeight();
    update();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", cacheHeight);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", cacheHeight);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    if (!hasFreshCache("artwork")) {
      getArtwork().then((all) => setFeatured(all.filter((a) => a.featured)));
    }
    if (!hasFreshCache("events")) {
      getEvents().then(setEvents);
    }
  }, []);

  // Cycle hero — pauses when lightbox is open
  const cycleHero = useCallback(() => {
    if (featured.length <= 1 || lightboxOpen.current) return;
    setHeroIndex((prev) => {
      prevHeroIndex.current = prev;
      return (prev + 1) % featured.length;
    });
  }, [featured.length]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(cycleHero, CYCLE_MS);
    return () => clearInterval(interval);
  }, [featured.length, cycleHero]);

  // Hero cycles through featured images
  const safeIndex = featured.length > 0 ? heroIndex % featured.length : 0;
  // If no featured items have images, reveal hero immediately
  const hasHeroImages = featured.some((f) => f.image);
  useEffect(() => { if (!hasHeroImages) setHeroReady(true); }, [hasHeroImages]);
  // Upcoming events
  const now = new Date();
  const toUTC = (d: string | null) => {
    if (!d) return 0;
    const [y, m, dd] = d.split("-").map(Number);
    return Date.UTC(y, m - 1, dd);
  };
  const todayUTC = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const upcomingEvents = events
    .filter((e) => e.startDate && toUTC(e.endDate ?? e.startDate) >= todayUTC)
    .slice(0, 2);

  return (
    <>
      <title>Mandy Dennis Art — Pastel Pet Portraits &amp; Wildlife Art, UK</title>
      {/* Hero — background cycles through featured, text overlaid */}
      <div ref={heroRef} className="relative overflow-hidden bg-surface">
        {/* Hero images — only render active + previous (for crossfade).
            Mounting all images at opacity:0 wastes compositor layers in Chrome. */}
        {featured.map((item, i) => {
          const isActive = i === safeIndex;
          const isPrev = i === prevHeroIndex.current;
          if (!item.image || (!isActive && !isPrev)) return null;
          return (
            <div
              key={item.slug}
              className={`absolute inset-0 ${instantSwitch ? "" : "transition-opacity duration-700 ease-in-out will-change-[opacity]"} ${
                isActive
                  ? (heroReady ? "opacity-100" : "opacity-0")
                  : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={!isActive}
            >
              <div
                ref={(el) => { if (el) parallaxImgs.current[i] = el; }}
                className="absolute inset-0 will-change-transform"
                style={{ transform: "scale(1.12) translate3d(0, 0px, 0)" }}
              >
                <img
                  src={heroUrl(item.image)}
                  alt=""
                  width={imageDimensions(item.image)?.width}
                  height={imageDimensions(item.image)?.height}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding={i === 0 ? "sync" : "async"}
                  fetchPriority={i === 0 ? "high" : undefined}
                  onLoad={i === 0 ? () => {
                    requestAnimationFrame(() => setHeroReady(true));
                  } : undefined}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-bg/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
            </div>
          );
        })}

        <div className="relative max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-hero)]">
          <div className="hero-stagger max-w-xl bg-bg/60 backdrop-blur-md border border-line rounded-lg p-[clamp(1.5rem,4vw,2.5rem)]">
            {/* Row 1: line + status + social icons */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-text/10" />
              <span className="flex items-center gap-2.5">
                <span className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium">Available for work</span>
                <span className="relative flex h-3 w-3 isolate">
                  <span className="absolute h-full w-full rounded-full bg-emerald-400/50 animate-ping" />
                  <span className="relative rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </span>
            </div>

            {/* Row 2: two columns on sm+, single column on mobile */}
            <div className="flex items-start gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="mb-5">
                  <TextReveal as="span" className="block font-display text-[clamp(3rem,8vw,5rem)] font-bold tracking-[-0.04em] leading-[0.85]">Mandy</TextReveal>
                  <TextReveal as="span" delay={0.08} className="block font-serif italic font-normal text-text-mid text-[clamp(3.5rem,9vw,6rem)] leading-[0.85]">Dennis</TextReveal>
                </h1>

                <p className="text-[1.05rem] text-text-mid leading-relaxed sm:max-w-[var(--width-text)] mb-8">
                  {settings.tagline || "Pet portraiture, wildlife, seascapes & still life — predominantly in soft pastels and watercolours."}
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link to="/gallery" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity">
                    View Gallery
                  </Link>
                  <Link to="/commissions" className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-3 text-[0.8rem] font-medium tracking-wide uppercase bg-surface/80 border border-text/15 text-text hover:bg-surface transition-colors">
                    Get in Touch
                  </Link>
                </div>
              </div>

              {/* Social icons — right side on all sizes */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <Link to="/commissions" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-text/[0.04] border border-text/[0.06] text-text-muted hover:text-text hover:bg-text/[0.08] transition-colors" aria-label="Get in touch">
                  <FaEnvelope size={14} />
                </Link>
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-text/[0.04] border border-text/[0.06] text-text-muted hover:text-text hover:bg-text/[0.08] transition-colors" aria-label="Instagram">
                    <FaInstagram size={15} />
                  </a>
                )}
              </div>
            </div>

            {/* Row 3: bottom stats with line */}
            <div className="flex gap-[clamp(1.5rem,4vw,3rem)] pt-5 mt-10 border-t border-text/10 flex-wrap">
              <div>
                <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Medium</div>
                <div className="font-display text-[0.85rem] font-semibold tracking-tight">Pastels & Watercolours</div>
              </div>
              <div>
                <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Subjects</div>
                <div className="font-display text-[0.85rem] font-semibold tracking-tight">Animals · Wildlife · Seascapes</div>
              </div>
            </div>
          </div>

          {featured.length > 1 && (
            <div className="flex gap-2.5 mt-6">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    prevHeroIndex.current = safeIndex;
                    setInstantSwitch(true);
                    setHeroIndex(i);
                    requestAnimationFrame(() => requestAnimationFrame(() => setInstantSwitch(false)));
                  }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === safeIndex
                      ? "w-8 h-2.5 bg-text/50 shadow-sm"
                      : "w-2.5 h-2.5 bg-text/15 hover:bg-text/25"
                  }`}
                  aria-label={`Show artwork ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <DrawLine />

      {/* Intro strip */}
      <div ref={introRef} className="cv-auto">
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[clamp(2rem,4vw,3rem)]">
          <div className={`anim-fade-up ${introInView ? "in-view" : ""} flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4`}>
            <p className="text-text-mid text-[1rem] leading-relaxed max-w-lg">
              Self-taught artist creating bespoke artwork for over 30 years. Born in Germany, raised across the world, now based in the UK.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 text-[0.78rem] font-medium tracking-wide uppercase text-text-muted hover:text-text transition-colors whitespace-nowrap min-h-11">
              About Mandy <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
      <DrawLine />

      {/* Featured Work — always shows ALL featured items */}
      {featured.length > 0 && (
        <>
          <div ref={featuredRef} className="cv-auto">
            <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
              <SectionHeader title="Featured Work" />
              <div className={`anim-fade-up ${featuredInView ? "in-view" : ""}`}>
                <MasonryGrid items={featured} onSelect={(_i, slug) => {
                  const idx = slug ? featured.findIndex((f) => f.slug === slug) : _i;
                  setLightboxIndex(idx >= 0 ? idx : _i);
                }} />
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
            items={featured}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(-1)}
            onChange={setLightboxIndex}
          />
        </>
      )}

      {/* Upcoming events teaser */}
      {upcomingEvents.length > 0 && (
        <>
          <div ref={eventsRef} className="cv-auto">
            <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
              <SectionHeader title="Upcoming Events" />
              <div className={`anim-fade-up ${eventsInView ? "in-view" : ""} space-y-3 max-w-[var(--width-narrow)]`}>
                {upcomingEvents.map((event) => (
                  <EventCard key={event.slug} event={event} isPast={false} compact />
                ))}
                <div className="pt-4">
                  <Link to="/events" className="inline-flex items-center gap-2 text-[0.78rem] font-medium tracking-wide uppercase text-text-muted hover:text-text transition-colors min-h-11">
                    All events <FaArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <DrawLine />
        </>
      )}

      <CtaBanner
        heading={<>Ready to <CtaAccent>commission?</CtaAccent></>}
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
