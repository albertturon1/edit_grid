import { useState } from "react";
import type { FilePickerRow } from "@/components/file-picker";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { Landing } from "@/features/home/components/landing";

export function HomePage() {
	const [data, setData] = useState<FilePickerRow[]>([]);

	return (
		<div
			className="flex flex-col gap-y-10"
			style={{
				height: window.innerHeight,
				overflow: "hidden",
			}}
		>
			{data.length === 0 ? (
				<Landing onFileChange={setData} />
			) : (
				<VirtualizedTable data={data} />
			)}
		</div>
	);
}
