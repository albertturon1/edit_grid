import { z } from "zod";

export const EXPORT_TYPE = {
  all: "all",
  selected: "selected",
} as const;

export const exportTypeSchema = z.enum([EXPORT_TYPE.all, EXPORT_TYPE.selected], {
  required_error: "The export type must be selected.",
});

const formSchema = z.object({
  filename: z
    .string({
      required_error: "File name cannot be empty.",
    })
    .min(1),
  includeHeaders: z.boolean(),
  exportType: exportTypeSchema,
});

export type ExportDialogFormSchema = z.infer<typeof formSchema>;
export { formSchema as exportDialogFormSchema };
