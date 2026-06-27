import type { FileSize } from "@uploadthing/shared";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_UPLOAD_SIZE_LABEL = "10MB";
export const UPLOADTHING_ROUTE_SIZE_LIMIT = "10MB" as unknown as FileSize;

export const ALLOWED_UPLOAD_EXTENSIONS = [
  "pdf",
  "docx",
  "png",
  "jpg",
  "jpeg",
  "ai",
  "svg",
  "zip",
] as const;

export const ALLOWED_UPLOAD_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "application/postscript",
  "image/svg+xml",
  "application/zip",
] as const;

export type AllowedUploadExtension = (typeof ALLOWED_UPLOAD_EXTENSIONS)[number];
export type AllowedUploadMimeType = (typeof ALLOWED_UPLOAD_MIME_TYPES)[number];

export function getFileExtension(fileName: string): string | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  return extension && extension !== fileName.toLowerCase() ? extension : null;
}

export function isAllowedUploadExtension(
  extension: string | null,
): extension is AllowedUploadExtension {
  return ALLOWED_UPLOAD_EXTENSIONS.some((allowed) => allowed === extension);
}

export function isAllowedUploadMimeType(
  mimeType: string,
): mimeType is AllowedUploadMimeType {
  return ALLOWED_UPLOAD_MIME_TYPES.some((allowed) => allowed === mimeType);
}
