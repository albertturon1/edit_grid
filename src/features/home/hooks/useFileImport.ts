import type { FileImportResult } from "@/lib/imports/types/import";
import { saveDraft } from "@/lib/stores/draftStorage";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

export function useFileImport() {
  const navigate = useNavigate();

  const importFile = async (importResult: FileImportResult) => {
    const result = await saveDraft({
      table: importResult.table,
      metadata: importResult.metadata,
    });

    if (!result.success) {
      if (result.error.reason === "size_exceeded") {
        toast.error("File too large", {
          description: `Maximum size is ${Math.round(result.error.limit / 1024)}KB`,
        });
        return;
      }

      toast.error("Import failed", {
        description: "Failed to save file",
      });
      return;
    }

    navigate({ to: "/room" });
  };

  return {
    importFile,
  };
}
