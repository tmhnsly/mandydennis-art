import { defineType, defineField } from "sanity";

export default defineType({
  name: "commissionCategory",
  title: "Pricing",
  type: "document",
  icon: () => "💰",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      description: "e.g. 'Pet Portraits in Pastels'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Click Generate to create automatically",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "options",
      title: "Sizes & Prices",
      type: "array",
      description: "Add each size option with its price",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "size", title: "Size", type: "string", description: "e.g. A5, A4, A3", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "string", description: "e.g. 'Head portrait', 'Full body'" }),
            defineField({ name: "price", title: "Price (£)", type: "number", validation: (rule) => rule.required().min(0) }),
          ],
          preview: {
            select: { title: "size", subtitle: "price", desc: "description" },
            prepare: ({ title, subtitle, desc }) => ({
              title: `${title ?? "Size"}${desc ? ` — ${desc}` : ""}`,
              subtitle: subtitle ? `£${subtitle}` : "",
            }),
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "addons",
      title: "Add-ons",
      type: "array",
      description: "Optional extras the customer can add",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "description", title: "What is it?", type: "string", description: "e.g. 'Extra pet', 'Specific background'", validation: (rule) => rule.required() }),
            defineField({ name: "price", title: "Price (£)", type: "number", validation: (rule) => rule.required().min(0) }),
          ],
          preview: {
            select: { title: "description", subtitle: "price" },
            prepare: ({ title, subtitle }) => ({
              title: title ?? "Add-on",
              subtitle: subtitle ? `+£${subtitle}` : "",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "included",
      title: "What's Included",
      type: "text",
      rows: 2,
      description: "e.g. 'A5–A3 includes a basic frame and mount'",
    }),
    defineField({
      name: "notes",
      title: "Additional Notes",
      type: "text",
      rows: 2,
      description: "e.g. 'Postage & packaging available if required'",
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
