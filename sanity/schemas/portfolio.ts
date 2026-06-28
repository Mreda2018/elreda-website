import { defineField, defineType } from "sanity";

export const portfolio = defineType({
  name: "portfolio",
  title: "Portfolio Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "ar", title: "Arabic", type: "string" }),
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      readOnly: ({ document }) => Boolean(document?._id && !document._id.startsWith("drafts.")),
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "isTranslated", title: "Arabic translation complete", type: "boolean", initialValue: false }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "industry", title: "Industry", type: "string" }),
    defineField({ name: "services", title: "Services", type: "array", of: [{ type: "reference", to: [{ type: "service" }] }] }),
    defineField({ name: "heroImage", title: "Hero image", type: "image", options: { hotspot: true } }),
    defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
    defineField({
      name: "challenge",
      title: "Challenge",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "block" }] }),
      ],
    }),
    defineField({
      name: "approach",
      title: "Approach",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "block" }] }),
      ],
    }),
    defineField({
      name: "process",
      title: "Process",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "block" }] }),
      ],
    }),
    defineField({
      name: "results",
      title: "Results",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "block" }] }),
      ],
    }),
    defineField({ name: "testimonial", title: "Testimonial", type: "reference", to: [{ type: "testimonial" }] }),
    defineField({ name: "technologies", title: "Technologies", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "featured", title: "Featured", type: "boolean", initialValue: false }),
    defineField({ name: "publishedAt", title: "Published at", type: "datetime" }),
  ],
});
