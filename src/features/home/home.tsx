import { useState } from "react";
import type { FilePickerRow } from "@/features/home/components/filepicker/file-picker";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { Landing } from "@/features/home/components/landing";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";
import type { TableHeaders } from "@/features/home/utils/mapHeadersToRows";
// import { useBlocker } from "@tanstack/react-router";

export function HomePage() {
	const [rows, setRows] = useState<FilePickerRow[]>([]);
	const [headers, setHeaders] = useState<TableHeaders | null>(null);
	const [originalFilename, setOriginalFilename] = useState<string>("");
	const { height } = useWindowDimensions();

	// // display alert before leaving this page
	// useBlocker({
	// 	condition: data.length > 0,
	// });

	return (
		<div
			className="overflow-hidden flex flex-col gap-y-10"
			style={{
				height: height - NAVBAR_HEIGHT,
			}}
		>
			{!headers ? (
				<Landing
					onFileImport={({ file, headers, rows }) => {
						setHeaders(headers);
						setRows(rows);
						setOriginalFilename(file.name);
					}}
				/>
			) : (
				<div className="w-full h-full px-5">
					<VirtualizedTable
						rows={rows}
						headers={headers}
						originalFilename={originalFilename}
						onRowsChange={setRows}
					/>
				</div>
			)}
		</div>
	);
}
