import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { SanityImage } from "../types";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;

export const isConfigured = Boolean(projectId);

export const client = isConfigured
  ? createClient({
      projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET || "production",
      useCdn: true,
      apiVersion: "2024-01-01",
      stega: false,
    })
  : null;

const builder = isConfigured && client ? createImageUrlBuilder(client) : null;

const nullBuilder = {
  width: () => nullBuilder,
  height: () => nullBuilder,
  auto: () => nullBuilder,
  quality: () => nullBuilder,
  url: () => "",
};

export function urlFor(source: SanityImage) {
  if (!builder || !source) return nullBuilder;
  return builder.image(source);
}
