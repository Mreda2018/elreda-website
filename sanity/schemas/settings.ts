import { defineField, defineType } from "sanity";

const internalPathValidationMessage = "Use an internal path starting with /, or leave empty.";

function validateInternalPath(value: unknown) {
  const path = String(value);

  if (!value || (path.startsWith("/") && !path.startsWith("//"))) {
    return true;
  }

  return internalPathValidationMessage;
}

const localizedStringFields = [
  defineField({ name: "en", title: "English", type: "string" }),
  defineField({ name: "ar", title: "Arabic", type: "string" }),
];

const localizedTextFields = [
  defineField({ name: "en", title: "English", type: "text" }),
  defineField({ name: "ar", title: "Arabic", type: "text" }),
];

export const settings = defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  fields: [
    defineField({ name: "contactPhone", title: "Contact phone", type: "string" }),
    defineField({ name: "contactEmail", title: "Contact email", type: "email" }),
    defineField({ name: "whatsappNumber", title: "WhatsApp number", type: "string" }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        defineField({ name: "en", title: "English", type: "string" }),
        defineField({ name: "ar", title: "Arabic", type: "string" }),
      ],
    }),
    defineField({
      name: "workingHours",
      title: "Working hours",
      type: "object",
      fields: localizedStringFields,
    }),
    defineField({
      name: "homeHero",
      title: "Home hero",
      type: "object",
      fields: [
        defineField({
          name: "isTranslated",
          title: "Arabic translation complete",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "object",
          fields: localizedStringFields,
        }),
        defineField({
          name: "headline",
          title: "Headline",
          type: "object",
          fields: localizedStringFields,
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "object",
          fields: localizedTextFields,
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: localizedStringFields,
            }),
            defineField({
              name: "href",
              title: "URL path",
              type: "string",
              validation: (rule) => rule.custom(validateInternalPath),
            }),
          ],
        }),
        defineField({
          name: "secondaryCta",
          title: "Secondary CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: localizedStringFields,
            }),
            defineField({
              name: "href",
              title: "URL path",
              type: "string",
              validation: (rule) => rule.custom(validateInternalPath),
            }),
          ],
        }),
        defineField({
          name: "statistics",
          title: "Statistics",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "value",
                  title: "Value",
                  type: "object",
                  fields: localizedStringFields,
                }),
                defineField({
                  name: "label",
                  title: "Label",
                  type: "object",
                  fields: localizedStringFields,
                }),
              ],
            },
          ],
          validation: (rule) => rule.max(3).warning("Hero supports up to 3 statistics."),
        }),
      ],
    }),
    defineField({
      name: "homeServices",
      title: "Home services section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow",
          type: "object",
          fields: localizedStringFields,
        }),
        defineField({
          name: "heading",
          title: "Heading",
          type: "object",
          fields: localizedStringFields,
        }),
        defineField({
          name: "description",
          title: "Description",
          type: "object",
          fields: localizedTextFields,
        }),
        defineField({
          name: "serviceItems",
          title: "Service items",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "object",
                  fields: localizedStringFields,
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "object",
                  fields: localizedTextFields,
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "href",
                  title: "URL path",
                  type: "string",
                  validation: (rule) => rule.required().custom(validateInternalPath),
                }),
                defineField({
                  name: "category",
                  title: "Category",
                  type: "object",
                  fields: localizedStringFields,
                }),
                defineField({
                  name: "icon",
                  title: "Icon placeholder",
                  type: "string",
                }),
                defineField({
                  name: "isTranslated",
                  title: "Arabic translation complete",
                  type: "boolean",
                  initialValue: false,
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "cta",
          title: "Section CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "object",
              fields: localizedStringFields,
            }),
            defineField({
              name: "href",
              title: "URL path",
              type: "string",
              validation: (rule) => rule.custom(validateInternalPath),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "socialMedia",
      title: "Social media",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram", type: "url" }),
        defineField({ name: "facebook", title: "Facebook", type: "url" }),
        defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
        defineField({ name: "behance", title: "Behance", type: "url" }),
        defineField({ name: "tiktok", title: "TikTok", type: "url" }),
        defineField({ name: "youtube", title: "YouTube", type: "url" }),
      ],
    }),
  ],
});
