import { mapHeadersToRows } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import type { OnFileImport } from "./headline-picker";

type HeadlineCsvExampleProps = {
	onFileImport: (props: OnFileImport) => void;
};

export function HeadlineCsvExample({ onFileImport }: HeadlineCsvExampleProps) {
	async function handleOnClick() {
		const response: Response = await fetch("public/example.csv");

		if (!response.ok) {
			throw new Error("Network response was not ok");
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
			<h1>{"Open example file"}</h1>
		</Button>
	);
}
