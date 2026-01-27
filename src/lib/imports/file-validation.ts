const KB_IN_BYTES = 1024;
const MB_IN_BYTES = 1024 * 1024;
const GB_IN_BYTES = 1024 * 1024 * 1024;

export type FileSizeUnit = "KB" | "MB" | "GB";

export type FileSizeLimit = {
  size: number;
  unit: FileSizeUnit;
};

export function convertToBytes(size: number, unit: FileSizeUnit): number {
  switch (unit) {
    case "KB":
      return size * KB_IN_BYTES;
    case "MB":
      return size * MB_IN_BYTES;
    case "GB":
      return size * GB_IN_BYTES;
  }
}

export function validateFileSize(file: File, limit?: FileSizeLimit): string | null {
  if (!limit) {
    return null;
  }

  const maxSizeInBytes = convertToBytes(limit.size, limit.unit);

  if (file.size > maxSizeInBytes) {
    return `File "${file.name}" is too big. Maximum size is ${limit.size}${limit.unit}.`;
  }

  return null;
}

/**
 * Validates that a file has an accepted extension.
 * @param file - The file to validate
 * @param acceptedExtensions - Array of extensions like [".csv", ".xlsx"]
 * @returns Error message string if invalid, null if valid
 */
export function validateFileExtension(file: File, acceptedExtensions?: string[]): string | null {
  if (!acceptedExtensions || acceptedExtensions.length === 0) {
    return null;
  }

  const fileName = file.name.toLowerCase();
  const hasValidExtension = acceptedExtensions.some((ext) => fileName.endsWith(ext.toLowerCase()));

  if (!hasValidExtension) {
    const formattedExtensions = acceptedExtensions.map((e) => e.replace(".", "")).join(", ");
    return `File "${file.name}" has an unsupported format. Accepted formats: ${formattedExtensions}.`;
  }

  return null;
}

export type FileValidationOptions = {
  fileSizeLimit?: FileSizeLimit;
  accept?: string[];
};

export function validateFile(file: File, options?: FileValidationOptions): string | null {
  const sizeError = validateFileSize(file, options?.fileSizeLimit);
  if (sizeError) {
    return sizeError;
  }

  const extensionError = validateFileExtension(file, options?.accept);
  if (extensionError) {
    return extensionError;
  }

  return null;
}
