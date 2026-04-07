import { defineType, defineField } from "sanity";

export default defineType({
  name: "artwork",
  title: "Artwork",
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
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Pastel", value: "pastel" },
          { title: "Watercolour", value: "watercolour" },
          { title: "Pencil", value: "pencil" },
          { title: "Oil", value: "oil" },
          { title: "Charcoal", value: "charcoal" },
          { title: "Mixed Media", value: "mixed media" },
          { title: "Acrylic", value: "acrylic" },
          { title: "Ink", value: "ink" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Pets", value: "pets" },
          { title: "Dogs", value: "dogs" },
          { title: "Cats", value: "cats" },
          { title: "Horses", value: "horses" },
          { title: "People", value: "people" },
          { title: "Landscape", value: "landscape" },
          { title: "Still Life", value: "still life" },
          { title: "Wildlife", value: "wildlife" },
          { title: "Flowers", value: "flowers" },
          { title: "Buildings", value: "buildings" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      initialValue: () => new Date().toISOString().split("T")[0],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", media: "image" },
  },
});
