import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { getArtwork, thumbnailUrl } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import FeaturedGrid from "../components/FeaturedGrid";
import DrawLine from "../components/DrawLine";
import type { Artwork } from "../types";

export default function HomePage() {
  const settings = useSiteSettings();
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [allArtwork, setAllArtwork] = useState<Artwork[]>([]);
  const bodyRef = useAnimateIn();

  useEffect(() => {
    getArtwork().then((all) => {
      setAllArtwork(all);
      setFeatured(all.filter((a) => a.featured));
    });
  }, []);

  const heroImage = featured.length > 0 ? featured[0] : allArtwork[0];

  return (
    <>
      {/* Hero */}
      <div>
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,6vw,5rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(2rem,5vw,4rem)] items-center">
            {/* Left: text */}
            <div>
              <h1 className="font-display text-[clamp(3rem,8vw,5.5rem)] font-bold tracking-[-0.04em] leading-[0.88] mb-5">
                <span className="hero-name-word">Mandy</span>
                <br />
                <em className="hero-name-word font-serif italic font-normal text-text-mid">Dennis</em>
              </h1>
              <p className="hero-tagline text-[1.05rem] text-text-mid leading-relaxed max-w-[440px] mb-8">
                {settings.tagline || "Pet portraiture, wildlife, seascapes & still life — predominantly in soft pastels and watercolours."}
              </p>
              <div className="hero-ctas flex gap-2.5 flex-wrap">
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 min-h-11 px-5 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity"
                >
                  View Gallery
                </Link>
                <Link
                  to="/commissions"
                  className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
                >
                  Commissions
                </Link>
              </div>

              {/* Stats row */}
              <div className="hero-stats flex gap-[clamp(1.5rem,4vw,3rem)] mt-10 pt-5 border-t border-line flex-wrap">
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

            {/* Right: hero image */}
            {heroImage && (
              <Link
                to="/gallery"
                className="hero-image block relative overflow-hidden aspect-[4/5] group"
              >
                <img
                  src={thumbnailUrl(heroImage.image)}
                  alt={heroImage.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(46,31,24,0.6)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <span className="font-display text-sm font-semibold text-white">{heroImage.title}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
      <DrawLine />

      {/* Featured Work */}
      {featured.length > 0 && (
        <>
          <div>
            <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
              <SectionHeader title="Featured Work" />
              <div ref={bodyRef} className="animate-in">
                <FeaturedGrid items={featured} />
                <div className="mt-8 text-center">
                  <Link
                    to="/gallery"
                    className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
                  >
                    <FaArrowRight size={14} />
                    Browse all work
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <DrawLine />
        </>
      )}
    </>
  );
}
