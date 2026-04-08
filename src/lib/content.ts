import { client, isConfigured, urlFor } from "./sanity";
import type {
  Artwork,
  ArtEvent,
  CommissionCategory,
  SiteSettings,
  AboutPage,
  Testimonial,
} from "../types";

// --- Dummy data for when Sanity isn't configured ---

const DUMMY_ARTWORK: Artwork[] = [
  {
    slug: "bella-pastel-portrait",
    title: "Bella - Pastel Portrait",
    image: null,
    description: "A soft pastel portrait of Bella the spaniel",
    medium: ["pastel"],
    subject: ["pets", "dogs"],
    featured: true,
    date: "2026-03-15",
  },
  {
    slug: "sunset-over-the-hills",
    title: "Sunset Over the Hills",
    image: null,
    description: "Watercolour landscape capturing golden hour",
    medium: ["watercolour"],
    subject: ["landscape"],
    featured: true,
    date: "2026-02-20",
  },
  {
    slug: "mrs-jenkins-pencil",
    title: "Mrs Jenkins - Pencil Sketch",
    image: null,
    description: "Detailed pencil portrait commission",
    medium: ["pencil"],
    subject: ["people"],
    featured: false,
    date: "2026-01-10",
  },
  {
    slug: "cat-nap-pastel",
    title: "Cat Nap",
    image: null,
    description: "Pastel study of a sleeping tabby cat",
    medium: ["pastel"],
    subject: ["pets", "cats"],
    featured: false,
    date: "2025-12-05",
  },
];

const DUMMY_EVENTS: ArtEvent[] = [
  {
    slug: "summer-exhibition",
    title: "Summer Exhibition",
    startDate: "2026-07-20",
    endDate: "2026-07-22",
    startTime: "10:00am",
    endTime: "4:00pm",
    location: "The Gallery, Stamford",
    description: "A group exhibition featuring local artists. New watercolour seascapes on display.",
    link: null,
  },
  {
    slug: "spring-art-fair-2026",
    title: "Spring Art Fair 2026",
    startDate: "2026-03-15",
    endDate: null,
    startTime: "10:00am",
    endTime: "3:00pm",
    location: "Village Hall, Oakham",
    description: "Exhibiting a selection of pet portraits and landscapes.",
    link: null,
  },
];

const DUMMY_COMMISSIONS: CommissionCategory[] = [
  {
    slug: "pet-portraits-pastels",
    title: "Pet Portraits in Pastels",
    options: [
      { size: "A5", description: "Head portrait", price: 80 },
      { size: "A4", description: "Head and shoulder", price: 100 },
      { size: "A4", description: "Full body", price: 120 },
      { size: "A3 or 12x12", description: "", price: 150 },
      { size: "Larger than A3", description: "Starting from", price: 300 },
    ],
    addons: [
      { description: "Each extra pet (A3)", price: 50 },
      { description: "Specific background", price: 50 },
    ],
    included: "A5-A3 includes a basic frame and mount. Add extra for specific frame requirements.",
    notes: "Extra for P&P if required.",
  },
];

const DUMMY_SETTINGS: SiteSettings = {
  tagline: "Original artwork & commissions",
  contact_email: "mandy@example.com",
  facebook_url: "",
  instagram_url: "",
  currency_symbol: "£",
};

const DUMMY_ABOUT: AboutPage = {
  bio: "Welcome to my art page! I'm Mandy Dennis, an artist based in the UK specialising in pastel pet portraits and watercolour landscapes. I've been creating art for over 30 years and love bringing your beloved pets to life on paper.",
  photo: null,
};

const DUMMY_TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah T.",
    quote: "Mandy captured our dog perfectly — the detail in the eyes is incredible. We were in tears when we saw it.",
    commission: "Pastel portrait of their spaniel",
  },
  {
    name: "James & Louise",
    quote: "We commissioned a portrait of our cat as a gift for my mum. She absolutely loved it. Mandy was lovely to work with.",
    commission: "Pastel portrait of a tabby cat",
  },
];

// --- Data fetching (cached, with timeout, falls back to dummy if empty) ---

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

// Simple in-memory cache — prevents re-fetching on navigation
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 30_000; // 30 seconds

function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < CACHE_TTL) return Promise.resolve(entry.data as T);
  return fetcher().then((data) => {
    cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

export function getArtwork(): Promise<Artwork[]> {
  if (!isConfigured || !client) return Promise.resolve(DUMMY_ARTWORK);
  const c = client;
  return cached("artwork", async () => {
    try {
      const results = await withTimeout(c.fetch(`
      *[_type == "artwork"] | order(date desc) {
        "slug": slug.current,
        title,
        image,
        description,
        medium,
        subject,
        featured,
        date
      }
    `), 3000);
    if (!results || results.length === 0) return DUMMY_ARTWORK;
    return results.map((item: Artwork) => ({
      ...item,
      description: item.description ?? "",
      medium: item.medium ?? [],
      subject: item.subject ?? [],
      featured: item.featured ?? false,
    }));
    } catch {
      return DUMMY_ARTWORK;
    }
  });
}

export function getEvents(): Promise<ArtEvent[]> {
  if (!isConfigured || !client) return Promise.resolve(DUMMY_EVENTS);
  const c = client;
  return cached("events", async () => {
    try {
      const results = await withTimeout(c.fetch(`
        *[_type == "event"] | order(coalesce(startDate, date) asc) {
          "slug": slug.current,
          title,
          "startDate": coalesce(startDate, date),
          endDate,
          startTime,
          endTime,
          location,
          description,
          link
        }
      `), 3000);
      if (!results || results.length === 0) return DUMMY_EVENTS;
      // Filter out any events missing a date entirely
      return results.filter((e: ArtEvent) => e.startDate);
    } catch {
      return DUMMY_EVENTS;
    }
  });
}

export function getCommissions(): Promise<CommissionCategory[]> {
  if (!isConfigured || !client) return Promise.resolve(DUMMY_COMMISSIONS);
  const c = client;
  return cached("commissions", async () => {
    try {
      const results = await withTimeout(c.fetch(`
        *[_type == "commissionCategory"] | order(title asc) {
          "slug": slug.current,
          title,
          options,
          addons,
          included,
          notes
        }
      `), 3000);
      return results && results.length > 0 ? results : DUMMY_COMMISSIONS;
    } catch {
      return DUMMY_COMMISSIONS;
    }
  });
}

export function getSettings(): Promise<SiteSettings> {
  if (!isConfigured || !client) return Promise.resolve(DUMMY_SETTINGS);
  const c = client;
  return cached("settings", async () => {
    try {
      const result = await withTimeout(c.fetch(`
        *[_type == "siteSettings"][0] {
          tagline,
          contact_email,
          facebook_url,
          instagram_url,
          currency_symbol
        }
      `), 3000);
      return result ?? DUMMY_SETTINGS;
    } catch {
      return DUMMY_SETTINGS;
    }
  });
}

export function getAbout(): Promise<AboutPage> {
  if (!isConfigured || !client) return Promise.resolve(DUMMY_ABOUT);
  const c = client;
  return cached("about", async () => {
    try {
      const result = await withTimeout(c.fetch(`
        *[_type == "about"][0] {
          bio,
        photo
      }
    `), 3000);
      return result ?? DUMMY_ABOUT;
    } catch {
      return DUMMY_ABOUT;
    }
  });
}

export function getTestimonials(): Promise<Testimonial[]> {
  if (!isConfigured || !client) return Promise.resolve(DUMMY_TESTIMONIALS);
  const c = client;
  return cached("testimonials", async () => {
    try {
      const results = await withTimeout(c.fetch(`
        *[_type == "testimonial"] {
          name,
          quote,
          commission
        }
      `), 3000);
      return results && results.length > 0 ? results : DUMMY_TESTIMONIALS;
    } catch {
      return DUMMY_TESTIMONIALS;
    }
  });
}

// --- Image helpers ---

// Inline SVG placeholder — no network request, matches the warm palette
const PLACEHOLDER_THUMB = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">' +
  '<rect fill="#f0e8e2" width="600" height="400"/>' +
  '<circle cx="300" cy="175" r="30" fill="none" stroke="#c8b8ad" stroke-width="1.5"/>' +
  '<path d="M288 175 L296 185 L312 165" fill="none" stroke="#c8b8ad" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<text x="300" y="230" text-anchor="middle" font-family="system-ui,sans-serif" font-size="13" font-weight="500" letter-spacing="0.1em" fill="#b0a096">ARTWORK</text>' +
  '</svg>'
)}`;

const PLACEHOLDER_FULL = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">' +
  '<rect fill="#f0e8e2" width="1600" height="1200"/>' +
  '<circle cx="800" cy="560" r="40" fill="none" stroke="#c8b8ad" stroke-width="1.5"/>' +
  '<path d="M784 560 L796 574 L816 548" fill="none" stroke="#c8b8ad" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
  '<text x="800" y="630" text-anchor="middle" font-family="system-ui,sans-serif" font-size="16" font-weight="500" letter-spacing="0.1em" fill="#b0a096">ARTWORK</text>' +
  '</svg>'
)}`;

export function thumbnailUrl(image: Artwork["image"]): string {
  if (!image) return PLACEHOLDER_THUMB;
  return urlFor(image).width(600).auto("format").quality(75).url() || PLACEHOLDER_THUMB;
}

export function fullUrl(image: Artwork["image"]): string {
  if (!image) return PLACEHOLDER_FULL;
  return urlFor(image).width(1600).auto("format").quality(80).url() || PLACEHOLDER_FULL;
}
