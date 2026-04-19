import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaQuoteLeft, FaArrowRight } from "react-icons/fa";
import { getAbout, getTestimonials, getInitialTestimonials, hasFreshCache } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { urlFor } from "../lib/sanity";
import { useAnimateIn, useInView } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import DrawLine from "../components/DrawLine";
import type { AboutPage as AboutData, Testimonial } from "../types";

export default function AboutPage() {
  const settings = useSiteSettings();
  const [about, setAbout] = useState<AboutData>({ bio: "", photo: null });
  const [testimonials, setTestimonials] = useState<Testimonial[]>(getInitialTestimonials);
  const { ref: bodyRef, isInView } = useAnimateIn();
  const { ref: testimonialsRef, isInView: testimonialsInView } = useInView(0.1);
  const { ref: ctaRef, isInView: ctaInView } = useInView(0.1);

  const [photoLoaded, setPhotoLoaded] = useState(false);

  useEffect(() => {
    getAbout().then(setAbout);
    if (!hasFreshCache("testimonials")) getTestimonials().then(setTestimonials);
  }, []);

  const onPhotoLoad = useCallback(() => setPhotoLoaded(true), []);

  return (
    <>
      <title>About — Mandy Dennis Art</title>
      {/* Bio section */}
      <div>
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
          <SectionHeader title="About" />

          <div ref={bodyRef} className={`anim-fade-up ${isInView ? "in-view" : ""} grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[clamp(2rem,5vw,3.5rem)] items-start`}>
            {about.photo ? (
              <div className="w-full aspect-[3/4] bg-surface border border-line overflow-hidden">
                <img
                  src={urlFor(about.photo).width(800).auto("format").quality(85).url()}
                  alt="Mandy Dennis"
                  loading="lazy"
                  decoding="async"
                  onLoad={onPhotoLoad}
                  className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${photoLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </div>
            ) : (
              <div className="w-full aspect-[3/4] bg-text/[0.03] border border-line flex items-center justify-center text-text-subtle text-xs tracking-widest uppercase">
                Photo
              </div>
            )}

            <div>
              <div className="text-base text-text-mid leading-[1.8] space-y-4 max-w-[65ch]">
                {about.bio ? (
                  about.bio.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)
                ) : (
                  <>
                    <p>Mandy Dennis is a self-taught artist based in the UK, specialising in pastel pet portraits, wildlife, seascapes and still life.</p>
                    <p>Born in a British Military Hospital in Germany where her father was serving as a soldier, Mandy grew up across the world — living in Hong Kong and Brunei — experiences that shaped a lifelong passion for art and culture.</p>
                    <p>She's been drawing for as long as she can remember, often found at family gatherings sketching portraits of whoever happened to be sitting opposite. Over 30 years later, she's still at it — bringing beloved pets and landscapes to life in soft pastels and watercolours.</p>
                  </>
                )}
              </div>

              <div className="mt-7 pt-5 border-t border-line flex gap-10 flex-wrap">
                <div>
                  <div className="text-[0.58rem] tracking-widest uppercase text-text-subtle font-medium mb-1">Medium</div>
                  <div className="font-display text-[0.88rem] font-semibold tracking-tight">Pastels & Watercolours</div>
                </div>
                <div>
                  <div className="text-[0.58rem] tracking-widest uppercase text-text-subtle font-medium mb-1">Subjects</div>
                  <div className="font-display text-[0.88rem] font-semibold tracking-tight">Pets · Wildlife · Seascapes</div>
                </div>
                <div>
                  <div className="text-[0.58rem] tracking-widest uppercase text-text-subtle font-medium mb-1">Based</div>
                  <div className="font-display text-[0.88rem] font-semibold tracking-tight">United Kingdom</div>
                </div>
              </div>

              {settings.facebook_url && (
                <div className="mt-6">
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 min-h-11 px-5 py-2.5 text-text text-sm font-medium border border-line-strong hover:bg-text hover:text-bg transition-colors"
                  >
                    Find me on Facebook
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <DrawLine />

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <>
          <div ref={testimonialsRef}>
            <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[var(--pad-section)]">
              <SectionHeader title="Kind Words" />

              <div className={`anim-fade-up ${testimonialsInView ? "in-view" : ""} grid grid-cols-1 md:grid-cols-2 gap-6`}>
                {testimonials.map((t, i) => (
                  <div key={i} className="border border-line bg-text/[0.03] p-6 flex flex-col">
                    <FaQuoteLeft size={16} className="text-text-subtle mb-4" />
                    <p className="text-[0.95rem] text-text-mid leading-relaxed flex-1">
                      {t.quote}
                    </p>
                    <div className="mt-5 pt-4 border-t border-line-faint">
                      <span className="font-display text-sm font-semibold">{t.name}</span>
                      {t.commission && (
                        <span className="text-xs text-text-subtle ml-2">— {t.commission}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DrawLine />
        </>
      )}

      {/* CTA */}
      <div ref={ctaRef}>
        <div className="max-w-[var(--width-content)] mx-auto px-[var(--pad-page)] py-[clamp(3rem,6vw,5rem)]">
          <div className={`anim-fade-up ${ctaInView ? "in-view" : ""} text-center max-w-lg mx-auto`}>
            <h2 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-bold tracking-tight mb-3">
              Want <span className="font-serif italic font-normal text-text-mid">your own?</span>
            </h2>
            <p className="text-text-mid mb-6">
              Commission a portrait of your pet, or browse the gallery to see more of Mandy's work.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link
                to="/commissions"
                className="inline-flex items-center gap-2 min-h-11 px-5 py-3 bg-text text-bg text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:opacity-85 transition-opacity"
              >
                Commissions
              </Link>
              <Link
                to="/gallery"
                className="inline-flex items-center gap-2 min-h-11 px-5 py-3 text-text text-[0.8rem] font-medium tracking-wide uppercase border border-text hover:bg-text hover:text-bg transition-colors"
              >
                <FaArrowRight size={14} />
                View Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
      <DrawLine />
    </>
  );
}
