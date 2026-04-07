// Sanity image reference object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SanityImage = any;

export interface Artwork {
  slug: string;
  title: string;
  image: SanityImage;
  description: string;
  medium: string[];
  subject: string[];
  featured: boolean;
  date: string;
}

export interface ArtEvent {
  slug: string;
  title: string;
  date: string;
  location: string;
  description: string;
  link: string;
}

export interface CommissionOption {
  size: string;
  description: string;
  price: number;
}

export interface CommissionAddon {
  description: string;
  price: number;
}

export interface CommissionCategory {
  slug: string;
  title: string;
  options: CommissionOption[];
  addons: CommissionAddon[];
  included: string;
  notes: string;
}

export interface SiteSettings {
  tagline: string;
  contact_email: string;
  facebook_url: string;
  currency_symbol: string;
}

export interface AboutPage {
  bio: string;
  photo: SanityImage;
}
