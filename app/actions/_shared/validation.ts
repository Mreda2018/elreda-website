import { z } from "zod";

import { ALLOWED_UPLOAD_MIME_TYPES } from "@/lib/uploadthing/config";

export const localeSchema = z.enum(["ar", "en"]);

export const honeypotSchema = z
  .string()
  .max(0, "Invalid submission.")
  .optional()
  .or(z.literal(""));

export const uploadedFileReferenceSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
  size: z.number().int().positive().max(10 * 1024 * 1024),
  type: z.enum(ALLOWED_UPLOAD_MIME_TYPES),
});

export function readFormDataString(formData: FormData, key: string): string {
  const value = formData.get(key);

  return typeof value === "string" ? value.trim() : "";
}
