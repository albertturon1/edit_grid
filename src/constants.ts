import { ALLOWED_FILE_EXTENSIONS } from "./lib/imports";

export const FILE_UPLOAD_OPTIONS = {
  fileSizeLimit: { size: 5, unit: "MB" as const },
  accept: ALLOWED_FILE_EXTENSIONS,
};