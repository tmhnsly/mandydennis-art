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
      name: "startDate",
      title: "Start Date",
      type: "date",
      description: "When does it start?",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date (optional)",
      type: "date",
      description: "Leave blank if it's a single day event",
    }),
    defineField({
      name: "startTime",
      title: "Start Time (optional)",
      type: "string",
      description: "e.g. '10:00am' or '2pm'. Leave blank if there's no specific start time.",
    }),
    defineField({
      name: "endTime",
      title: "End Time (optional)",
      type: "string",
      description: "e.g. '4:00pm' or '8pm'. Leave blank for open-ended events.",
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
      description: "Optional. Full URL starting with https:// — e.g. a Facebook event page or a venue's website.",
    }),
  ],
  orderings: [
    { title: "Date (Newest)", name: "dateDesc", by: [{ field: "startDate", direction: "desc" }] },
    { title: "Date (Oldest)", name: "dateAsc", by: [{ field: "startDate", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", start: "startDate", end: "endDate" },
    prepare: ({ title, start, end }) => ({
      title: title ?? "Event",
      subtitle: end ? `${start} → ${end}` : start ?? "",
    }),
  },
});
