"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";

import type { SubmissionActionState } from "@/app/actions/_shared/submissionState";
import { protectFormSubmission } from "@/app/actions/_shared/security";
import {
  honeypotSchema,
  localeSchema,
  readFormDataString,
} from "@/app/actions/_shared/validation";
import { createSubmission } from "@/lib/supabase/submissions";

const serviceValues = ["branding", "web", "ecommerce", "erp", "ai", "printing"] as const;
const budgetValues = ["starter", "growth", "premium", "notSure"] as const;
const timelineValues = ["urgent", "month", "quarter", "flexible"] as const;
const preferredContactValues = ["whatsapp", "email", "phone"] as const;

const optionalPhoneSchema = z
  .string()
  .max(40)
  .regex(/^[+\d\s().-]*$/)
  .optional();

const quoteSchema = z.object({
  locale: localeSchema,
  website: honeypotSchema,
  services: z.array(z.enum(serviceValues)).min(1),
  company: z.string().max(160).optional(),
  name: z.string().min(2).max(120),
  message: z.string().min(10).max(3000),
  budget: z.enum(budgetValues),
  timeline: z.enum(timelineValues),
  email: z.string().email().max(160),
  phone: optionalPhoneSchema,
  preferredContact: z.enum(preferredContactValues),
});

export async function submitQuoteForm(
  _state: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  const requestedLocale = localeSchema.safeParse(readFormDataString(formData, "locale"));
  const locale = requestedLocale.success ? requestedLocale.data : "ar";
  const t = await getTranslations({ locale, namespace: "forms" });
  const website = readFormDataString(formData, "website");

  if (website) {
    return {
      status: "success",
      message: t("common.submitSuccess"),
    };
  }

  const parsed = quoteSchema.safeParse({
    locale,
    website,
    services: formData
      .getAll("services")
      .filter((value): value is string => typeof value === "string"),
    company: readFormDataString(formData, "company") || undefined,
    name: readFormDataString(formData, "name"),
    message: readFormDataString(formData, "message"),
    budget: readFormDataString(formData, "budget"),
    timeline: readFormDataString(formData, "timeline"),
    email: readFormDataString(formData, "email"),
    phone: readFormDataString(formData, "phone") || undefined,
    preferredContact: readFormDataString(formData, "preferredContact"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: t("common.submitError"),
    };
  }

  const protection = await protectFormSubmission({
    formType: "quote",
    turnstileToken: readFormDataString(formData, "cf-turnstile-response"),
  });

  if (!protection.allowed) {
    return {
      status: "error",
      message:
        protection.reason === "rate_limited"
          ? t("common.rateLimitError")
          : t("common.turnstileError"),
    };
  }

  try {
    const data = {
      services: parsed.data.services,
      company: parsed.data.company,
      name: parsed.data.name,
      message: parsed.data.message,
      budget: parsed.data.budget,
      timeline: parsed.data.timeline,
      email: parsed.data.email,
      phone: parsed.data.phone,
      preferredContact: parsed.data.preferredContact,
    };

    await createSubmission({
      type: "quote",
      locale: parsed.data.locale,
      data,
    });

    return {
      status: "success",
      message: t("common.submitSuccess"),
    };
  } catch {
    return {
      status: "error",
      message: t("common.submitError"),
    };
  }
}
