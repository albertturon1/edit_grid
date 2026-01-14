import { z } from "zod";

export const selectedCellSchema = z.object({
  rowIndex: z.number(),
  colId: z.string(),
});

export const userStateSchema = z.object({
  name: z.string(),
  color: z.string(),
  selectedCell: selectedCellSchema.nullable(),
});

export type SelectedCell = z.infer<typeof selectedCellSchema>;
export type UserState = z.infer<typeof userStateSchema>;
export type RemoteUser = UserState & { clientId: number };
