import { useState, useEffect } from "react";
import { getAbout } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { urlFor } from "../lib/sanity";
import { useAnimateIn } from "../hooks/useAnimateIn";
import SectionHeader from "../components/SectionHeader";
import type { AboutPage as AboutData } from "../types";
import DrawLine from "../components/DrawLine";

export default function AboutPage() {
  const settings = useSiteSettings();
  const [about, setAbout] = useState<AboutData>({ bio: "", photo: null });
  const bodyRef = useAnimateIn();

  useEffect(() => {
    getAbout().then(setAbout);
  }, []);

  return (
    <>
    <div>
      <div className="max-w-[1400px] mx-auto px-[clamp(1.5rem,5vw,4rem)] py-[clamp(2.5rem,6vw,4.5rem)]">
        <SectionHeader title="About" />

        <div ref={bodyRef} className="animate-in grid grid-cols-1 md:grid-cols-[280px_1fr] gap-[clamp(2rem,5vw,3.5rem)] items-start">
          {about.photo ? (
            <img
              src={urlFor(about.photo).width(400).auto("format").url()}
              alt="Mandy Dennis"
              className="w-full aspect-[3/4] object-cover border border-line"
            />
          ) : (
            <div className="w-full aspect-[3/4] bg-text/[0.03] border border-line flex items-center justify-center text-text-subtle text-xs tracking-widest uppercase">
              Photo
            </div>
          )}

          <div>
            <div className="text-base text-text-mid leading-[1.8] space-y-4">
              <p>
                Mandy Dennis is a self-taught artist whose work is extremely varied, including
                pet portraiture, wildlife, seascapes and still life. Her medium is predominantly
                soft pastels or watercolours.
              </p>
              <p>
                Born in a British Military Hospital in Germany where her father was serving as a
                soldier, she has also lived in Hong Kong and Brunei — experiences which enriched
                her passion for arts and culture.
              </p>
              <p>
                As a child, Mandy could be found at family gatherings scribbling a portrait of
                the lucky person opposite. Her favourite lessons at school were always art, drama
                &amp; music.
              </p>
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
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-text text-sm font-medium border border-line-strong hover:bg-text hover:text-bg transition-colors"
                >
                  Find me on Facebook
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <DrawLine delay={2} />
    </>
  );
}
