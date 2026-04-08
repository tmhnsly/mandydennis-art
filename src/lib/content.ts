import { client, isConfigured, urlFor } from "./sanity";
import type {
  Artwork,
  ArtEvent,
  CommissionCategory,
  SiteSettings,
  AboutPage,
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
    date: "2026-07-20",
    location: "The Gallery, Stamford",
    description: "A group exhibition featuring local artists. New watercolour seascapes on display.",
    link: "",
  },
  {
    slug: "spring-art-fair-2026",
    title: "Spring Art Fair 2026",
    date: "2026-03-15",
    location: "Village Hall, Oakham",
    description: "Exhibiting a selection of pet portraits and landscapes.",
    link: "",
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

// --- Data fetching (Sanity or dummy fallback) ---

export async function getArtwork(): Promise<Artwork[]> {
  if (!isConfigured || !client) return DUMMY_ARTWORK;
  try {
    const results = await client.fetch(`
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
    `);
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
}

export async function getEvents(): Promise<ArtEvent[]> {
  if (!isConfigured || !client) return DUMMY_EVENTS;
  try {
    return await client.fetch(`
      *[_type == "event"] | order(date asc) {
        "slug": slug.current,
        title,
        date,
        location,
        description,
        link
      }
    `);
  } catch {
    return DUMMY_EVENTS;
  }
}

export async function getCommissions(): Promise<CommissionCategory[]> {
  if (!isConfigured || !client) return DUMMY_COMMISSIONS;
  try {
    return await client.fetch(`
      *[_type == "commissionCategory"] | order(title asc) {
        "slug": slug.current,
        title,
        options,
        addons,
        included,
        notes
      }
    `);
  } catch {
    return DUMMY_COMMISSIONS;
  }
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isConfigured || !client) return DUMMY_SETTINGS;
  try {
    const result = await client.fetch(`
      *[_type == "siteSettings"][0] {
        tagline,
        contact_email,
        facebook_url,
        instagram_url,
        currency_symbol
      }
    `);
    return result ?? DUMMY_SETTINGS;
  } catch {
    return DUMMY_SETTINGS;
  }
}

export async function getAbout(): Promise<AboutPage> {
  if (!isConfigured || !client) return DUMMY_ABOUT;
  try {
    const result = await client.fetch(`
      *[_type == "about"][0] {
        bio,
        photo
      }
    `);
    return result ?? DUMMY_ABOUT;
  } catch {
    return DUMMY_ABOUT;
  }
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
