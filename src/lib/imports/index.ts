import { csvParser } from "./parsers/csv-parser";

const PARSERS = {
  ".csv": csvParser,
} as const;

export const ALLOWED_FILE_EXTENSIONS = Object.keys(PARSERS);

export async function parseFile(file: File) {
  const ext = `.${file.name.split(".").pop()?.toLowerCase()}`;
  const parser = PARSERS[ext as keyof typeof PARSERS];

  return parser?.parse(file);
}
