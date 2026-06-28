import { defineField, defineType } from "sanity";

export const service = defineType({
  name: "service",
  title: "Service",
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
    defineField({
      name: "isTranslated",
      title: "Arabic translation complete",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
        defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "block" }] }),
      ],
    }),
    defineField({ name: "icon", title: "Icon", type: "image", options: { hotspot: true } }),
    defineField({
      name: "features",
      title: "Features",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "array", of: [{ type: "string" }] }),
        defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "string" }] }),
      ],
    }),
    defineField({
      name: "process",
      title: "Process",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "step", title: "Step", type: "number" }),
            defineField({
              name: "title",
              title: "Title",
              type: "object",
              fields: [
                defineField({ name: "en", title: "English", type: "string" }),
                defineField({ name: "ar", title: "Arabic", type: "string" }),
              ],
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "object",
              fields: [
                defineField({ name: "en", title: "English", type: "text" }),
                defineField({ name: "ar", title: "Arabic", type: "text" }),
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "object",
              fields: [
                defineField({ name: "en", title: "English", type: "string" }),
                defineField({ name: "ar", title: "Arabic", type: "string" }),
              ],
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "object",
              fields: [
                defineField({ name: "en", title: "English", type: "array", of: [{ type: "block" }] }),
                defineField({ name: "ar", title: "Arabic", type: "array", of: [{ type: "block" }] }),
              ],
            }),
          ],
        },
      ],
    }),
    defineField({ name: "relatedServices", title: "Related services", type: "array", of: [{ type: "reference", to: [{ type: "service" }] }] }),
    defineField({ name: "portfolio", title: "Portfolio", type: "array", of: [{ type: "reference", to: [{ type: "portfolio" }] }] }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "object",
          fields: [
            defineField({ name: "en", title: "English", type: "string" }),
            defineField({ name: "ar", title: "Arabic", type: "string" }),
          ],
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "object",
          fields: [
            defineField({ name: "en", title: "English", type: "text" }),
            defineField({ name: "ar", title: "Arabic", type: "text" }),
          ],
        }),
      ],
    }),
  ],
});
