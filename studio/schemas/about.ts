import { defineType, defineField } from "sanity";

export default defineType({
  name: "about",
  title: "About Me",
  type: "document",
  icon: () => "👩‍🎨",
  fields: [
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      rows: 8,
      description: "Tell people about yourself and your art",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photo",
      title: "Photo of Me",
      type: "image",
      options: { hotspot: true },
      description: "A photo of yourself to show on the About page. Tap the image once uploaded to set the focus point.",
      fields: [
        defineField({
          name: "alt",
          title: "Description for screen readers",
          type: "string",
          description: "Optional but kind. Short description for people who can't see the image, e.g. 'Mandy at her studio easel'.",
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "About Me" }),
  },
});
