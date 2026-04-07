import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getArtwork } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import FeaturedGrid from "../components/FeaturedGrid";
import type { Artwork } from "../types";

export default function HomePage() {
  const settings = useSiteSettings();
  const [featured, setFeatured] = useState<Artwork[]>([]);

  useEffect(() => {
    getArtwork().then((all) => setFeatured(all.filter((a) => a.featured)));
  }, []);

  return (
    <div>
      <section className="px-6 py-16 md:px-12 md:py-24 text-center">
        <h1 className="font-display text-4xl md:text-6xl text-warm-800 mb-4">
          Mandy Dennis
        </h1>
        <p className="text-warm-500 text-lg md:text-xl max-w-xl mx-auto">
          {settings.tagline}
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/gallery"
            className="px-6 py-3 bg-warm-800 text-white rounded-lg font-medium hover:bg-warm-700 transition-colors"
          >
            View Gallery
          </Link>
          <Link
            to="/commissions"
            className="px-6 py-3 border border-warm-300 text-warm-700 rounded-lg font-medium hover:bg-warm-100 transition-colors"
          >
            Commissions
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="px-6 pb-16 md:px-12 max-w-7xl mx-auto">
          <h2 className="font-display text-2xl text-warm-800 mb-6">
            Featured Work
          </h2>
          <FeaturedGrid items={featured} />
        </section>
      )}
    </div>
  );
}
