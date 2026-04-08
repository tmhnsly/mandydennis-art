import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { getArtwork, getInitialArtwork, getEvents, getInitialEvents, thumbnailUrl } from "../lib/content";
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
  const [allArtwork, setAllArtwork] = useState<Artwork[]>(initial);
  const [events, setEvents] = useState<ArtEvent[]>(getInitialEvents);
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const lightboxOpen = useRef(false);
  const { ref: featuredRef, isInView: featuredInView } = useInView(0.1);
  const { ref: introRef, isInView: introInView } = useInView(0.1);
  const { ref: eventsRef, isInView: eventsInView } = useInView(0.1);

  // Track lightbox state in ref so the cycle interval can read it
  lightboxOpen.current = lightboxIndex >= 0;

  useEffect(() => { document.title = "Mandy Dennis Art"; }, []);

  useEffect(() => {
    getArtwork().then((all) => {
      setAllArtwork(all);
      setFeatured(all.filter((a) => a.featured));
    });
    getEvents().then(setEvents);
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
  const heroImage = featured.length > 0 ? featured[safeIndex] : allArtwork[0];

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
      <div className="relative overflow-hidden">
        {/* Crossfade: render all featured images, only the active one is visible */}
        {featured.map((item, i) => (
          <div
            key={item.slug}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === safeIndex ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== safeIndex}
          >
            <img
              src={thumbnailUrl(item.image)}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              onLoad={i === 0 ? () => setHeroLoaded(true) : undefined}
              className={`w-full h-full object-cover ${i === 0 && !heroLoaded ? "opacity-0" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-bg/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
          </div>
        ))}

        {/* Fallback if no featured images */}
        {featured.length === 0 && heroImage && (
          <div className="absolute inset-0">
            <img src={thumbnailUrl(heroImage.image)} alt="" loading="eager" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-bg/70 via-bg/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
          </div>
        )}

        <div className="relative max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,8vw,7rem)]">
          {/* Glassmorphism panel behind hero text */}
          <div className="hero-stagger max-w-xl backdrop-blur-md bg-bg/40 border border-line rounded-lg p-[clamp(1.5rem,4vw,2.5rem)]">
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
              <Link to="/commissions" className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-[0.8rem] font-medium tracking-wide uppercase backdrop-blur-sm bg-bg/30 border border-text/20 text-text hover:bg-bg/50 transition-colors">
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
                <div className="font-display text-[0.85rem] font-semibold tracking-tight">Pets · Wildlife · Seascapes</div>
              </div>
            </div>
          </div>

          {featured.length > 1 && (
            <div className="flex gap-1.5 mt-8">
              {featured.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i === safeIndex ? "w-6 bg-text/60" : "w-1.5 bg-text/20 hover:bg-text/30"
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
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2rem,4vw,3rem)]">
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
            <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
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
            <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
              <SectionHeader title="Upcoming Events" />
              <div className={`anim-fade-up ${eventsInView ? "in-view" : ""} space-y-3 max-w-[700px]`}>
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
