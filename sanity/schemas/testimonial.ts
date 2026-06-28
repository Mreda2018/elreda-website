import { defineField, defineType } from "sanity";

export const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "text", validation: (rule) => rule.required() }),
        defineField({ name: "ar", title: "Arabic", type: "text" }),
      ],
    }),
    defineField({ name: "clientName", title: "Client name", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "company", title: "Company", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "rating", title: "Rating", type: "number", validation: (rule) => rule.min(1).max(5) }),
  ],
});
