import type { ReactNode } from "react";
import Papa from "papaparse";
import { mapHeadersToRows } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import { Button } from "@/components/ui/button";
import type { OnFileImport } from "@/features/home/components/headline-picker";
import { toast, useToast } from "@/components/hooks/use-toast";

type HeadlineCsvExampleProps = {
	onFileImport: (props: OnFileImport) => void;
	children: ReactNode;
	filepath: string;
};

export function HeadlineCsvExample({
	onFileImport,
	children,
	filepath,
}: HeadlineCsvExampleProps) {
	const { toast } = useToast();
	async function handleOnClick() {
		try {
			const response: Response = await fetch(filepath);
			if (!response.ok) {
				toast({
					title: "Cannot open provided file.",
					duration: 4000,
				});

				return;
			}

			// Read the response as a Blob
			const blob: Blob = await response.blob();

			// Create a File from the Blob
			const file: File = new File([blob], "example.csv", { type: "text/csv" });

			Papa.parse(file, {
				skipEmptyLines: true,
				complete: (result) => {
					onSubmitSetData({
						file,
						data: result.data as string[][],
						fromRow: 1,
						firstRowAsHeaders: true,
					});
				},
			});
		} catch (error) {
			toast({
				title:
					"Failed to open example file. Please try to use a different file.",
				variant: "destructive",
			});
		}
	}

	function onSubmitSetData(props: {
		file: File;
		data: string[][];
		fromRow: number;
		firstRowAsHeaders: boolean;
	}) {
		const { headers, rows } = mapHeadersToRows(
			props.data,
			props.firstRowAsHeaders,
			props.fromRow,
		);

		onFileImport({
			file: props.file,
			headers,
			rows,
		});
	}

	return (
		<Button variant={"outline"} onClick={handleOnClick}>
			{children}
		</Button>
	);
}
