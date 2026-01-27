import { type ChangeEvent, type MouseEvent, type Ref, useImperativeHandle, useRef } from "react";
import { toast } from "sonner";
import { parseFile } from "@/lib/imports";
import { validateFile, type FileSizeLimit } from "@/lib/imports/file-validation";
import type { RawTableData } from "@/lib/imports/parsers/types";

export type FilePickerCoreRef = {
  showFilePicker: (event: MouseEvent<HTMLElement>) => void;
};

export type FilePickerCoreProps = {
  onFileImport: (file: File, result: RawTableData) => void;
  options: {
    fileSizeLimit: FileSizeLimit;
    accept: string[];
  };
  ref: Ref<FilePickerCoreRef>;
};

export function FilePickerCore({ onFileImport, options, ref }: FilePickerCoreProps) {
  const { fileSizeLimit, accept } = options ?? {};

  const acceptExtensions = accept?.join(", ");

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => {
    return {
      showFilePicker: (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        inputRef.current?.click();
      },
    };
  }, []);

  async function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const firstFile = event?.target.files?.[0];

    if (!firstFile) {
      toast.error("Cannot open provided file.", {
        description: "Try again with a different file.",
      });
      return;
    }

    const validationError = validateFile(firstFile, {
      fileSizeLimit,
      accept,
    });

    if (validationError) {
      toast.error(validationError, {
        description: "Try again with a different file.",
      });
      return;
    }

    const parsedFile = await parseFile(firstFile);

    if (!parsedFile.success) {
      toast.error(`Unsupported file format: ${firstFile.name}`, {
        description: "Try again with a supported format.",
      });
      return;
    }

    onFileImport(firstFile, parsedFile.data);
    event.target.value = "";
  }

  return (
    <input
      ref={inputRef}
      accept={acceptExtensions}
      type="file"
      hidden
      onChange={handleInputChange}
    />
  );
}
