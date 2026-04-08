import { defineType, defineField } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  icon: () => "💬",
  fields: [
    defineField({
      name: "name",
      title: "Customer Name",
      type: "string",
      description: "e.g. 'Sarah T.'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "quote",
      title: "What they said",
      type: "text",
      rows: 3,
      description: "The testimonial text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "commission",
      title: "What was commissioned (optional)",
      type: "string",
      description: "e.g. 'Pastel portrait of their spaniel'",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "quote" },
    prepare: ({ title, subtitle }) => ({
      title: title ?? "Testimonial",
      subtitle: subtitle ? subtitle.slice(0, 80) + "…" : "",
    }),
  },
});
