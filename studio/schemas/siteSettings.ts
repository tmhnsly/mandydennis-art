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
      description: "Where commission enquiries are sent. Must be a valid email address.",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "facebook_url",
      title: "Facebook Page",
      type: "url",
      description: "Optional. Full URL — must start with https:// and be your Facebook page (not just your username).",
    }),
    defineField({
      name: "instagram_url",
      title: "Instagram Page",
      type: "url",
      description: "Optional. Full URL — must start with https:// and be your Instagram profile (not just your username).",
    }),
    defineField({
      name: "currency_symbol",
      title: "Currency Symbol",
      type: "string",
      description: "Shown before all prices on the website. Currently set to £; only change if you start selling in another currency.",
      initialValue: "£",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Settings" }),
  },
});
