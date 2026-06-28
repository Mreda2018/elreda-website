import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  fields: [
    defineField({ name: "from", title: "From", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "to", title: "To", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "permanent", title: "Permanent", type: "boolean", initialValue: true }),
  ],
});

