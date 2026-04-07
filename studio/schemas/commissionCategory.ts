import { defineType, defineField } from "sanity";

export default defineType({
  name: "commissionCategory",
  title: "Commission Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "options",
      title: "Price Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "size", title: "Size", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", title: "Description", type: "string" }),
            defineField({ name: "price", title: "Price", type: "number", validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "size", subtitle: "price" },
            prepare: ({ title, subtitle }) => ({
              title: title ?? "Option",
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
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "description", title: "Description", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "price", title: "Price", type: "number", validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { title: "description", subtitle: "price" },
            prepare: ({ title, subtitle }) => ({
              title: title ?? "Add-on",
              subtitle: subtitle ? `£${subtitle}` : "",
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
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
