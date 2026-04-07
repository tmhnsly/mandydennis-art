import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { getAbout } from "../lib/content";
import { useSiteSettings } from "../context/SiteSettings";
import { urlFor } from "../lib/sanity";
import type { AboutPage as AboutData } from "../types";

export default function AboutPage() {
  const settings = useSiteSettings();
  const [about, setAbout] = useState<AboutData>({ bio: "", photo: null });

  useEffect(() => {
    getAbout().then(setAbout);
  }, []);

  return (
    <div className="px-6 py-8 md:px-12 md:py-12 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl md:text-4xl text-warm-800 mb-8">
        About
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {about.photo && (
          <div className="md:w-1/3 flex-shrink-0">
            <img
              src={urlFor(about.photo).width(400).auto("format").url()}
              alt="Mandy Dennis"
              className="rounded-lg w-full object-cover"
            />
          </div>
        )}
        <div className="prose prose-warm max-w-none">
          <ReactMarkdown>{about.bio}</ReactMarkdown>
        </div>
      </div>

      {settings.facebook_url && (
        <div className="mt-8">
          <a
            href={settings.facebook_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-warm-200 text-warm-700 rounded-lg font-medium hover:bg-warm-300 transition-colors"
          >
            Find me on Facebook
          </a>
        </div>
      )}
    </div>
  );
}
