import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/hooks/use-toast";
import { EXAMPLE_CONFIGS } from "@/config/example-configs";
import type { FileImportResult } from "@/lib/imports/types/import";
import { parseFile } from "@/lib/imports";
import { normalizeRawTableData } from "@/lib/imports/transformers/normalizeRawTableData";

type HeadlineCsvExampleProps = {
	onFileImport: (data: FileImportResult) => void;
	children: ReactNode;
	filepath: string;
};

export function HeadlineCsvExample({
	onFileImport,
	children,
	filepath,
}: HeadlineCsvExampleProps) {
	async function handleOnClick() {
		const config = EXAMPLE_CONFIGS.find((c) => c.filepath === filepath);

		if (config) {
			return;
		}

		const response: Response = await fetch(filepath);
		if (!response.ok) {
			toast({
				title: "Cannot open provided file.",
				duration: 4000,
			});

			return;
		}

		const blob: Blob = await response.blob();

		const file: File = new File([blob], filepath.split("/").pop() || filepath, {
			type: "text/csv",
		});

		const parsedFile = await parseFile(file);
		if (!parsedFile.success) {
			toast({
				title: `Unsupported file format: ${file.name}`,
				description: "Try again with a supported format.",
			});
			return;
		}

		const normalized = normalizeRawTableData(parsedFile.data, {
			firstRowAsHeaders: true,
		});

		if (!normalized) {
			toast({
				title: "Invalid file content.",
				duration: 4000,
			});
			return;
		}

		const result: FileImportResult = {
			file,
			table: normalized.table,
			metadata: {
				filename: file.name,
				firstRowValues: normalized.firstRowValues,
			},
		};

		onFileImport(result);
	}

	return (
		<Button variant={"outline"} onClick={handleOnClick}>
			{children}
		</Button>
	);
}
