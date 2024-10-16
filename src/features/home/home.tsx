import { useState } from "react";
import type { FilePickerRow } from "@/features/home/components/headline-file-picker";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { Landing } from "@/features/home/components/landing";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";
import type { TableHeaders } from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type { OnFileImport } from "./components/headline-picker";
import { useBlocker } from "@tanstack/react-router";

export function HomePage() {
	const [rows, setRows] = useState<FilePickerRow[]>([]);
	const [headers, setHeaders] = useState<TableHeaders | null>(null);
	const [originalFilename, setOriginalFilename] = useState<string>("");
	const { height } = useWindowDimensions();

	function onFileImport({ file, headers, rows }: OnFileImport) {
		handleOnDataUpdate({ headers, rows });
		setOriginalFilename(file.name);
	}

	function handleOnDataUpdate({
		headers,
		rows,
	}: Pick<OnFileImport, "headers" | "rows">) {
		setHeaders(headers);
		setRows(rows);
	}

	// const { proceed, reset, status } = useBlocker({
	useBlocker({
		blockerFn: () => "Are you sure you want to leave?",
		condition: rows.length > 0,
	});

	return (
		<div
			className="overflow-hidden flex flex-col gap-y-10"
			style={{
				height: height - NAVBAR_HEIGHT,
			}}
		>
			{!headers ? (
				<Landing onFileImport={onFileImport} />
			) : (
				<>
					<div className="w-full h-full px-2 sm:px-5">
						<VirtualizedTable
							rows={rows}
							headers={headers}
							originalFilename={originalFilename}
							onRowsChange={setRows}
							onFileImport={onFileImport}
							onDataUpdate={handleOnDataUpdate}
						/>
					</div>
				</>
			)}
		</div>
	);
}
