import { defineType, defineField } from "sanity";

export default defineType({
  name: "commissionCategory",
  title: "Commission Prices",
  type: "document",
  icon: () => "🏷️",
  fields: [
    defineField({
      name: "title",
      title: "What type of commission is this?",
      type: "string",
      description: "e.g. 'Pet Portraits in Pastels', 'Watercolour Landscapes'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Click Generate — this is created automatically from the name above",
      hidden: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "options",
      title: "Sizes & Prices",
      type: "array",
      description: "Add a row for each size you offer. Click the + button to add more.",
      of: [
        {
          type: "object",
          title: "Size option",
          fields: [
            defineField({
              name: "size",
              title: "Size",
              type: "string",
              description: "e.g. A5, A4, A3, 12×12, Larger than A3",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "What's included at this size?",
              type: "string",
              description: "e.g. 'Head portrait', 'Head and shoulder', 'Full body'. Leave blank if not needed.",
            }),
            defineField({
              name: "price",
              title: "Price (£)",
              type: "number",
              description: "Enter only the number, e.g. 80. The £ symbol is added automatically on the website.",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: { size: "size", price: "price", desc: "description" },
            prepare: ({ size, price, desc }) => ({
              title: `${size ?? "?"}${desc ? ` — ${desc}` : ""}`,
              subtitle: price != null ? `£${price}` : "",
            }),
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "addons",
      title: "Extras / Add-ons",
      type: "array",
      description: "Optional. Things customers can add on top (e.g. extra pets, a specific background). Leave the whole section blank if not needed.",
      of: [
        {
          type: "object",
          title: "Add-on",
          fields: [
            defineField({
              name: "description",
              title: "What is it?",
              type: "string",
              description: "e.g. 'Each extra pet', 'Specific background'",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price",
              title: "Extra cost (£)",
              type: "number",
              description: "Enter only the number, e.g. 50. The £ symbol is added automatically.",
              validation: (rule) => rule.required().min(0),
            }),
          ],
          preview: {
            select: { title: "description", subtitle: "price" },
            prepare: ({ title, subtitle }) => ({
              title: title ?? "Add-on",
              subtitle: subtitle != null ? `+£${subtitle}` : "",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "included",
      title: "What's included in the price?",
      type: "text",
      rows: 2,
      description: "Optional. What comes with the price (e.g. 'A5–A3 includes a basic frame and mount. Add extra for a specific frame.').",
    }),
    defineField({
      name: "notes",
      title: "Anything else to mention?",
      type: "text",
      rows: 2,
      description: "Optional. Anything else customers should know (e.g. 'Postage & packaging available on request').",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
