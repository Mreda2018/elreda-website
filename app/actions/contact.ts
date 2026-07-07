"use server";

import { getTranslations } from "next-intl/server";
import { z } from "zod";

import type { SubmissionActionState } from "@/app/actions/_shared/submissionState";
import {
  honeypotSchema,
  localeSchema,
  readFormDataString,
} from "@/app/actions/_shared/validation";
import { createSubmission } from "@/lib/supabase/submissions";

const optionalPhoneSchema = z
  .string()
  .max(40)
  .regex(/^[+\d\s().-]*$/)
  .optional();

const contactSchema = z.object({
  locale: localeSchema,
  website: honeypotSchema,
  name: z.string().min(2).max(120),
  company: z.string().max(160).optional(),
  email: z.string().email().max(160),
  phone: optionalPhoneSchema,
  service: z.string().max(80).optional(),
  message: z.string().min(10).max(3000),
});

export async function submitContactForm(
  _state: SubmissionActionState,
  formData: FormData,
): Promise<SubmissionActionState> {
  const parsed = contactSchema.safeParse({
    locale: readFormDataString(formData, "locale"),
    website: readFormDataString(formData, "website"),
    name: readFormDataString(formData, "name"),
    company: readFormDataString(formData, "company") || undefined,
    email: readFormDataString(formData, "email"),
    phone: readFormDataString(formData, "phone") || undefined,
    service: readFormDataString(formData, "service") || undefined,
    message: readFormDataString(formData, "message"),
  });

  const locale = parsed.success ? parsed.data.locale : "ar";
  const t = await getTranslations({ locale, namespace: "forms" });

  if (!parsed.success) {
    return {
      status: "error",
      message: t("common.submitError"),
    };
  }

  try {
    const data = {
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      service: parsed.data.service,
      message: parsed.data.message,
    };

    await createSubmission({
      type: "contact",
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
