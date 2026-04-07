import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;

export const isConfigured = Boolean(projectId);

export const client = isConfigured
  ? createClient({
      projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET || "production",
      useCdn: true,
      apiVersion: "2024-01-01",
    })
  : null;

const builder = isConfigured && client ? imageUrlBuilder(client) : null;

const nullBuilder = {
  width: () => nullBuilder,
  height: () => nullBuilder,
  auto: () => nullBuilder,
  quality: () => nullBuilder,
  url: () => "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  if (!builder || !source) return nullBuilder;
  return builder.image(source);
}
