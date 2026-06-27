import { UploadThingError } from "uploadthing/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import {
  MAX_UPLOAD_BYTES,
  MAX_UPLOAD_SIZE_LABEL,
  UPLOADTHING_ROUTE_SIZE_LIMIT,
  getFileExtension,
  isAllowedUploadExtension,
  isAllowedUploadMimeType,
} from "@/lib/uploadthing/config";

const f = createUploadthing({
  errorFormatter: (error) => ({
    message: error.message,
  }),
});

export const uploadRouter = {
  quoteAttachment: f({
    "application/pdf": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
    "image/png": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
    "image/jpeg": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
    "application/postscript": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
    "image/svg+xml": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
    "application/zip": {
      maxFileSize: UPLOADTHING_ROUTE_SIZE_LIMIT,
      maxFileCount: 1,
    },
  })
    .middleware(({ files }) => {
      for (const file of files) {
        const extension = getFileExtension(file.name);

        if (!isAllowedUploadExtension(extension) || !isAllowedUploadMimeType(file.type)) {
          throw new UploadThingError("Unsupported file type.");
        }

        if (file.size > MAX_UPLOAD_BYTES) {
          throw new UploadThingError(`File must be ${MAX_UPLOAD_SIZE_LABEL} or smaller.`);
        }
      }

      return {};
    })
    .onUploadComplete(({ file }) => ({
      key: file.key,
      name: file.name,
      url: file.ufsUrl,
      size: file.size,
      type: file.type,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
