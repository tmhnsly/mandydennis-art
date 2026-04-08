import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa";
import { getArtwork, getInitialArtwork, getEvents, getInitialEvents, heroUrl } from "../lib/content";
import CtaBanner from "../components/CtaBanner";
import ArtworkLightbox from "../components/ArtworkLightbox";
import { useSiteSettings } from "../context/SiteSettings";
import { useInView } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import FeaturedGrid from "../components/FeaturedGrid";
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
  const heroRef = useRef<HTMLDivElement>(null);
  const parallaxImgs = useRef<HTMLImageElement[]>([]);
  const lightboxOpen = useRef(false);
  const { ref: featuredRef, isInView: featuredInView } = useInView(0.1);
  const { ref: introRef, isInView: introInView } = useInView(0.1);
  const { ref: eventsRef, isInView: eventsInView } = useInView(0.1);

  lightboxOpen.current = lightboxIndex >= 0;

  useEffect(() => { document.title = "Mandy Dennis Art"; }, []);

  // Parallax — direct DOM, single getBoundingClientRect, translate3d for GPU
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const el = heroRef.current;
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom > 0) {
            const y = -rect.top * 0.12;
            for (const img of parallaxImgs.current) {
              if (img) img.style.transform = `scale(1.08) translate3d(0,${y}px,0)`;
            }
          }
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    getArtwork().then((all) => {
      const newFeatured = all.filter((a) => a.featured);
      // Only update if data actually changed (avoids re-render with same cache data)
      setFeatured((prev) =>
        prev.length === newFeatured.length && prev.every((p, i) => p.slug === newFeatured[i]?.slug)
          ? prev
          : newFeatured
      );
    });
    getEvents().then((newEvents) => {
      setEvents((prev) =>
        prev.length === newEvents.length && prev.every((p, i) => p.slug === newEvents[i]?.slug)
          ? prev
          : newEvents
      );
    });
  }, []);

  // Cycle hero — pauses when lightbox is open
  const cycleHero = useCallback(() => {
    if (featured.length <= 1 || lightboxOpen.current) return;
    setHeroIndex((i) => (i + 1) % featured.length);
  }, [featured.length]);

  useEffect(() => {
    if (featured.length <= 1) return;
    const interval = setInterval(cycleHero, CYCLE_MS);
    return () => clearInterval(interval);
  }, [featured.length, cycleHero]);

  // Hero cycles through featured images
  const safeIndex = featured.length > 0 ? heroIndex % featured.length : 0;
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
      {/* Hero — background cycles through featured, text overlaid */}
      <div ref={heroRef} className="relative overflow-hidden bg-surface">
        {/* Hero images — all rendered, only active is visible via opacity */}
        {featured.map((item, i) => (
          item.image ? (
            <div
              key={item.slug}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === safeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              aria-hidden={i !== safeIndex}
            >
              <img
                src={heroUrl(item.image)}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : undefined}
                ref={(el) => { if (el) parallaxImgs.current[i] = el; }}
                className="w-full h-full object-cover object-center will-change-transform"
                style={{ transform: "scale(1.08) translate3d(0,0,0)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-bg/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
            </div>
          ) : null
        ))}

        <div className="relative max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-hero)]">
          <div className="hero-stagger max-w-xl backdrop-blur-[var(--blur-glass)] bg-bg/50 border border-line rounded-lg p-[clamp(1.5rem,4vw,2.5rem)] relative">
            {/* Top-right info block */}
            <div className="absolute top-[clamp(1.5rem,4vw,2.5rem)] right-[clamp(1.5rem,4vw,2.5rem)] hidden sm:flex flex-col items-end gap-3">
              <span className="flex items-center gap-2.5">
                <span className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium">Open for commissions</span>
                <span className="relative flex h-3 w-3">
                  <span className="absolute h-full w-full rounded-full bg-emerald-400/50 animate-ping" />
                  <span className="relative rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              </span>
              <div className="flex gap-1">
                {settings.contact_email && (
                  <a href={`mailto:${settings.contact_email}`} className="min-w-10 min-h-10 flex items-center justify-center rounded-full backdrop-blur-sm bg-text/[0.04] border border-text/[0.06] text-text-muted hover:text-text hover:bg-text/[0.08] transition-colors" aria-label="Email">
                    <FaEnvelope size={14} />
                  </a>
                )}
                {settings.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="min-w-10 min-h-10 flex items-center justify-center rounded-full backdrop-blur-sm bg-text/[0.04] border border-text/[0.06] text-text-muted hover:text-text hover:bg-text/[0.08] transition-colors" aria-label="Facebook">
                    <FaFacebookF size={14} />
                  </a>
                )}
                {settings.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="min-w-10 min-h-10 flex items-center justify-center rounded-full backdrop-blur-sm bg-text/[0.04] border border-text/[0.06] text-text-muted hover:text-text hover:bg-text/[0.08] transition-colors" aria-label="Instagram">
                    <FaInstagram size={15} />
                  </a>
                )}
              </div>
            </div>

            <h1 className="mb-5">
              <TextReveal as="span" className="block font-display text-[clamp(3rem,8vw,5rem)] font-bold tracking-[-0.04em] leading-[0.85]">Mandy</TextReveal>
              <TextReveal as="span" delay={0.08} className="block font-serif italic font-normal text-text-mid text-[clamp(3.5rem,9vw,6rem)] leading-[0.85]">Dennis</TextReveal>
            </h1>

            <p className="text-[1.05rem] text-text-mid leading-relaxed max-w-[var(--width-text)] mb-8">
              {settings.tagline || "Pet portraiture, wildlife, seascapes & still life — predominantly in soft pastels and watercolours."}
            </p>

            <div className="flex gap-2.5 flex-wrap mb-10">
              <Link to="/gallery" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity">
                View Gallery
              </Link>
              <Link to="/commissions" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-[0.8rem] font-medium tracking-wide uppercase bg-surface/80 border border-text/15 text-text hover:bg-surface transition-colors">
                Commissions
              </Link>
            </div>

            <div className="flex gap-[clamp(1.5rem,4vw,3rem)] pt-5 border-t border-text/10 flex-wrap">
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
                  onClick={() => setHeroIndex(i)}
                  className={`rounded-full backdrop-blur-md transition-all duration-300 ${
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
      <div ref={introRef}>
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
          <div ref={featuredRef}>
            <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
              <SectionHeader title="Featured Work" />
              <div className={`anim-fade-up ${featuredInView ? "in-view" : ""}`}>
                <FeaturedGrid items={featured} onSelect={(i) => setLightboxIndex(i)} />
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
          <div ref={eventsRef}>
            <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
              <SectionHeader title="Upcoming Events" />
              <div className={`anim-fade-up ${eventsInView ? "in-view" : ""} space-y-3 max-w-[var(--width-narrow)]`}>
                {upcomingEvents.map((event) => {
                  const [, m, d] = event.startDate.split("-").map(Number);
                  const date = new Date(Date.UTC(2026, m - 1, d));
                  const day = date.getUTCDate();
                  const month = date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });

                  return (
                    <div key={event.slug} className="border border-line p-5 flex items-center gap-5">
                      <div className="text-center flex-shrink-0 w-12">
                        <div className="font-display font-bold text-xl leading-none">{day}</div>
                        <div className="text-[0.55rem] tracking-widest uppercase text-text-subtle font-medium mt-0.5">{month}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display font-semibold text-[0.9rem] tracking-tight">{event.title}</div>
                        <div className="flex items-center gap-1.5 text-[0.78rem] text-text-muted mt-0.5">
                          <FaMapMarkerAlt size={10} className="text-text-subtle flex-shrink-0" />
                          {event.location}
                        </div>
                      </div>
                      <span className="text-[0.55rem] tracking-widest uppercase text-accent font-medium px-2.5 py-1 border border-accent/30 flex-shrink-0">
                        Upcoming
                      </span>
                    </div>
                  );
                })}
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
