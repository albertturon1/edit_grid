import { parseFile } from "@/lib/imports";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { FileImportResult } from "@/lib/imports/types/import";
import { saveDraft } from "@/lib/stores/draftStorage";
import type { Result } from "@/types/result";
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

  const importExample = async (filepath: string) => {
    const result = await importExampleFile(filepath);

    if (!result.success) {
      switch (result.error.reason) {
        case "fetch_failed": {
          toast.error("Failed to load example file");
          return;
        }

        case "unsupported_format": {
          toast.info("Unsupported file format");
          return;
        }
        case "invalid_content": {
          toast.info("Invalid file content");
          return;
        }

        default: {
          const _never: never = result.error;
          return _never;
        }
      }
    }

    await importFile(result.data);
  };

  return {
    importFile,
    importExample,
  };
}

export type ImportExampleError =
  | { reason: "fetch_failed" }
  | { reason: "unsupported_format" }
  | { reason: "invalid_content" };

export async function importExampleFile(
  filepath: string,
): Promise<Result<FileImportResult, ImportExampleError>> {
  const response = await fetch(filepath);

  if (!response.ok) {
    return {
      success: false,
      error: { reason: "fetch_failed" },
    };
  }

  const blob = await response.blob();
  const filename = filepath.split("/").pop() ?? filepath;

  const file = new File([blob], filename, { type: "text/csv" });

  const parsed = await parseFile(file);
  if (!parsed.success) {
    return {
      success: false,
      error: { reason: "unsupported_format" },
    };
  }

  const normalized = normalizeRawTableData(parsed.data, {
    firstRowAsHeaders: true,
  });

  if (!normalized) {
    return {
      success: false,
      error: { reason: "invalid_content" },
    };
  }

  return {
    success: true,
    data: {
      file,
      table: normalized.table,
      metadata: {
        filename,
        firstRowValues: normalized.firstRowValues,
      },
    },
  };
}
