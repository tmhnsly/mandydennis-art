import { client, urlFor } from "./sanity";
import type {
  Artwork,
  ArtEvent,
  CommissionCategory,
  SiteSettings,
  AboutPage,
} from "../types";

export async function getArtwork(): Promise<Artwork[]> {
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
}

export async function getEvents(): Promise<ArtEvent[]> {
  return client.fetch(`
    *[_type == "event"] | order(date asc) {
      "slug": slug.current,
      title,
      date,
      location,
      description,
      link
    }
  `);
}

export async function getCommissions(): Promise<CommissionCategory[]> {
  return client.fetch(`
    *[_type == "commissionCategory"] | order(title asc) {
      "slug": slug.current,
      title,
      options,
      addons,
      included,
      notes
    }
  `);
}

export async function getSettings(): Promise<SiteSettings> {
  const result = await client.fetch(`
    *[_type == "siteSettings"][0] {
      tagline,
      contact_email,
      facebook_url,
      currency_symbol
    }
  `);
  return result ?? {
    tagline: "",
    contact_email: "",
    facebook_url: "",
    currency_symbol: "£",
  };
}

export async function getAbout(): Promise<AboutPage> {
  const result = await client.fetch(`
    *[_type == "about"][0] {
      bio,
      photo
    }
  `);
  return result ?? { bio: "", photo: "" };
}

export function thumbnailUrl(image: Artwork["image"]): string {
  if (!image) return "";
  return urlFor(image).width(600).auto("format").quality(80).url();
}

export function fullUrl(image: Artwork["image"]): string {
  if (!image) return "";
  return urlFor(image).width(1600).auto("format").quality(85).url();
}
