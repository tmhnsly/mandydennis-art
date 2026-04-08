import { defineType, defineField } from "sanity";

export default defineType({
  name: "event",
  title: "Events & Exhibitions",
  type: "document",
  icon: () => "📅",
  fields: [
    defineField({
      name: "title",
      title: "Event Name",
      type: "string",
      description: "e.g. 'Spring Art Fair 2026'",
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
      name: "date",
      title: "Date",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "e.g. 'Village Hall, Oakham'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      description: "Tell people what to expect",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "link",
      title: "Link (optional)",
      type: "url",
      description: "Link to more info, e.g. a Facebook event",
    }),
  ],
  orderings: [
    { title: "Date (Newest)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
    { title: "Date (Oldest)", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
