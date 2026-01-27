import { useState } from "react";
import {
  ImportSettingsDialog,
  type ImportSettingsFormSchema,
} from "@/components/import-settings-dialog";
import type { RawTableData } from "@/lib/imports/parsers/types";
import { toast } from "sonner";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { FileImportResult } from "@/lib/imports/types/import";
import type { FileSizeLimit } from "@/lib/imports/file-validation";
import { DragDropFile } from "./drag-drop-file";
import { useFileDrop } from "@/hooks/useFileDrop";

type Imported = {
  file: File;
  rawData: RawTableData;
};

export type DragDropFileUploaderProps = {
  className?: string;
  onFileImport: (data: FileImportResult) => void;
  options: {
    fileSizeLimit: FileSizeLimit;
    accept: string[];
  };
};

export function DragDropFileUploader({
  options,
  onFileImport,
  className,
}: DragDropFileUploaderProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imported, setImported] = useState<Imported | null>(null);

  const { isDragging, handlers } = useFileDrop({
    options,
    onFileImport: (file, rawData) => {
      setImported({ file, rawData });
      setDialogOpen(true);
    },
  });

  function handleImportDialogSubmit({ firstRowAsHeaders }: ImportSettingsFormSchema) {
    if (!imported) {
      toast.info("Something went wrong. Please try later");
      return;
    }

    const data = normalizeRawTableData(imported.rawData, {
      firstRowAsHeaders,
    });

    if (data) {
      onFileImport({
        file: imported.file,
        table: data.table,
        metadata: {
          filename: imported.file.name,
          firstRowValues: data.firstRowValues,
        },
      });
    }

    handleOnCancel();
  }

  function handleOnCancel() {
    setImported(null);
    setDialogOpen(false);
  }

  return (
    <>
      <DragDropFile
        isDragging={isDragging}
        onDragOver={handlers.onDragOver}
        onDragLeave={handlers.onDragLeave}
        onDrop={handlers.onDrop}
        title={"Drag and drop your file here"}
        subtitle={`Accepts ${options.accept
          .map((e) => e.replace(".", ""))
          .join(", ")
          .toUpperCase()} • Max ${options.fileSizeLimit.size}${options.fileSizeLimit.unit}`}
        className={className}
      />
      <ImportSettingsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCancel={handleOnCancel}
        onSubmit={handleImportDialogSubmit}
      />
    </>
  );
}
