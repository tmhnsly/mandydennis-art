import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Image, ArrowRight, Star } from "lucide-react";
import { getArtwork } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import FeaturedGrid from "../components/FeaturedGrid";
import type { Artwork } from "../types";

export default function HomePage() {
  const settings = useSiteSettings();
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const bodyRef = useAnimateIn();

  useEffect(() => {
    getArtwork().then((all) => setFeatured(all.filter((a) => a.featured)));
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="border-b border-line">
        <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(4rem,10vw,8rem)] pb-[clamp(3rem,6vw,5rem)]">
          <div className="hero-stagger-1 text-[0.65rem] font-medium tracking-[0.18em] uppercase text-text-subtle mb-4">
            Self-taught artist · UK Based
          </div>
          <h1 className="hero-stagger-2 font-display text-[clamp(3.5rem,10vw,7rem)] font-bold tracking-[-0.05em] leading-[0.85] mb-6">
            Mandy<br />
            <em className="font-serif italic font-normal text-text-mid">Dennis</em>
          </h1>
          <p className="hero-stagger-3 text-[1.1rem] text-text-mid leading-relaxed max-w-[520px]">
            {settings.tagline || "Pet portraiture, wildlife, seascapes & still life — predominantly in soft pastels and watercolours."}
          </p>
          <div className="hero-stagger-4 flex gap-2.5 mt-8 flex-wrap">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-5 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity"
            >
              <Image size={16} />
              View Gallery
            </Link>
            <Link
              to="/commissions"
              className="inline-flex items-center gap-2 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
            >
              Commissions
            </Link>
          </div>

          <div className="hero-stagger-5 flex gap-[clamp(2rem,5vw,4rem)] mt-[clamp(3rem,6vw,5rem)] pt-5 border-t border-line flex-wrap">
            <div>
              <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Medium</div>
              <div className="font-display text-[0.88rem] font-semibold tracking-tight">Pastels & Watercolours</div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Subjects</div>
              <div className="font-display text-[0.88rem] font-semibold tracking-tight">Pets · Wildlife · Seascapes</div>
            </div>
            <div>
              <div className="text-[0.6rem] tracking-widest uppercase text-text-subtle font-medium mb-0.5">Commissions</div>
              <div className="font-display text-[0.88rem] font-semibold tracking-tight">from {settings.currency_symbol}80</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Work */}
      {featured.length > 0 && (
        <div className="border-b border-line">
          <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
            <SectionHeader icon={Star} title="Featured Work" />
            <div ref={bodyRef} className="animate-in">
              <FeaturedGrid items={featured} />
              <div className="mt-8 text-center">
                <Link
                  to="/gallery"
                  className="inline-flex items-center gap-2 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
                >
                  <ArrowRight size={16} />
                  Browse all work
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
