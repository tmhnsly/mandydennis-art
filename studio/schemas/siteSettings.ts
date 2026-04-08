import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Settings",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short description shown on the homepage, e.g. 'Original artwork & commissions'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contact_email",
      title: "Contact Email",
      type: "string",
      description: "Where commission enquiries get sent to",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "facebook_url",
      title: "Facebook Page",
      type: "url",
      description: "Full URL to your Facebook page",
    }),
    defineField({
      name: "instagram_url",
      title: "Instagram Page",
      type: "url",
      description: "Full URL to your Instagram profile",
    }),
    defineField({
      name: "currency_symbol",
      title: "Currency Symbol",
      type: "string",
      description: "Shown before all prices",
      initialValue: "£",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Settings" }),
  },
});
