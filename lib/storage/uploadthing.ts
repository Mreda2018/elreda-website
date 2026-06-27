import "server-only";

import { UTApi } from "uploadthing/server";

import {
  MAX_UPLOAD_BYTES,
  getFileExtension,
  isAllowedUploadExtension,
  isAllowedUploadMimeType,
} from "@/lib/uploadthing/config";

export type UploadedFileReference = {
  key: string;
  name: string;
  url: string;
  size: number;
  type: string;
};

export function createUploadthingApi(): UTApi {
  return new UTApi();
}

export function validateUploadedFileReference(
  file: UploadedFileReference,
): UploadedFileReference {
  const extension = getFileExtension(file.name);

  if (!isAllowedUploadExtension(extension) || !isAllowedUploadMimeType(file.type)) {
    throw new Error("Unsupported upload type.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("Uploaded file exceeds the 10MB limit.");
  }

  return file;
}
