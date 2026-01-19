import { useRef, useState } from "react";
import { UploadFileButton } from "@/components/upload-file-button";
import {
  FilePickerCore,
  type FilePickerCoreProps,
  type FilePickerCoreRef,
} from "@/components/file-picker-core";
import {
  ImportSettingsDialog,
  type ImportSettingsFormSchema,
} from "@/components/import-settings-dialog";
import type { RawTableData } from "@/lib/imports/parsers/types";
import { toast } from "sonner";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";
import type { FileImportResult } from "@/lib/imports/types/import";

type Imported = {
  file: File;
  rawData: RawTableData;
};

export type FileUploaderProps = Omit<FilePickerCoreProps, "onFileImport"> & {
  className?: string;
  onFileImport: (data: FileImportResult) => void;
};

export function FileUploader({ options, onFileImport, className }: FileUploaderProps) {
  const inputRef = useRef<FilePickerCoreRef>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imported, setImported] = useState<Imported | null>(null);

  function handleOnFileImport(...[file, rawData]: Parameters<FilePickerCoreProps["onFileImport"]>) {
    setImported({
      file,
      rawData,
    });

    setDialogOpen(true);
  }

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
      <UploadFileButton
        onClick={(e) => {
          inputRef.current?.showFilePicker(e);
        }}
        title={"Click here to upload your file"}
        subtitle={`File size limit: ${options.fileSizeLimit.size}${options.fileSizeLimit.unit}`}
        className={className}
      />
      <FilePickerCore options={options} ref={inputRef} onFileImport={handleOnFileImport} />
      <ImportSettingsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCancel={handleOnCancel}
        onSubmit={handleImportDialogSubmit}
      />
    </>
  );
}
