import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contact_email",
      title: "Contact Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "facebook_url",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "instagram_url",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "currency_symbol",
      title: "Currency Symbol",
      type: "string",
      initialValue: "£",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings" }),
  },
});
