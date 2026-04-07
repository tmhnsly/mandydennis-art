import matter from "gray-matter";
import type {
  Artwork,
  ArtEvent,
  CommissionCategory,
  SiteSettings,
  AboutPage,
} from "../types";

const artworkFiles = import.meta.glob("/content/artwork/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const eventFiles = import.meta.glob("/content/events/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const commissionFiles = import.meta.glob("/content/commissions/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const aboutFile = import.meta.glob("/content/pages/about.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const settingsFile = import.meta.glob("/content/settings.json", {
  eager: true,
  import: "default",
}) as Record<string, SiteSettings>;

function slugFromPath(path: string): string {
  return path.split("/").pop()!.replace(/\.md$/, "");
}

export function getArtwork(): Artwork[] {
  return Object.entries(artworkFiles)
    .map(([path, raw]) => {
      const { data } = matter(raw);
      return {
        slug: slugFromPath(path),
        title: data.title ?? "",
        image: data.image ?? "",
        description: data.description ?? "",
        medium: data.medium ?? [],
        subject: data.subject ?? [],
        featured: data.featured ?? false,
        date: data.date ?? "",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getEvents(): ArtEvent[] {
  return Object.entries(eventFiles)
    .map(([path, raw]) => {
      const { data, content } = matter(raw);
      return {
        slug: slugFromPath(path),
        title: data.title ?? "",
        date: data.date ?? "",
        location: data.location ?? "",
        description: content.trim(),
        link: data.link ?? "",
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getCommissions(): CommissionCategory[] {
  return Object.entries(commissionFiles).map(([path, raw]) => {
    const { data } = matter(raw);
    return {
      slug: slugFromPath(path),
      title: data.title ?? "",
      options: data.options ?? [],
      addons: data.addons ?? [],
      included: data.included ?? "",
      notes: data.notes ?? "",
    };
  });
}

export function getSettings(): SiteSettings {
  const entries = Object.values(settingsFile);
  return entries[0] ?? {
    tagline: "",
    contact_email: "",
    facebook_url: "",
    currency_symbol: "\u00a3",
  };
}

export function getAbout(): AboutPage {
  const entries = Object.entries(aboutFile);
  if (entries.length === 0) return { bio: "", photo: "" };
  const { data } = matter(entries[0][1]);
  return {
    bio: data.bio ?? "",
    photo: data.photo ?? "",
  };
}
