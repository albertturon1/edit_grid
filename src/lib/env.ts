/// <reference types="vite/client" />
import z from "zod";

const envSchema = z.object({
  VITE_PARTYKIT_HOST: z.string(),
});

const _env = {
  VITE_PARTYKIT_HOST: import.meta.env.VITE_PARTYKIT_HOST,
};

const parsed = envSchema.safeParse(_env);

if (!parsed.success) {
  // oxlint-disable-next-line no-console
  console.error(
    "Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
    "\nMake sure all required variables are defined in the .env file.",
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
