import { useState } from "react";
import type { FilePickerRow } from "@/components/file-picker";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { Landing } from "@/features/home/components/landing";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";

export function HomePage() {
	const [data, setData] = useState<FilePickerRow[]>([]);
	const { height } = useWindowDimensions();

	return (
		<div
			className="overflow-hidden flex flex-col gap-y-10"
			style={{
				height: height - NAVBAR_HEIGHT,
			}}
		>
			{data.length === 0 ? (
				<Landing onFileChange={setData} />
			) : (
				<VirtualizedTable data={data} onDataChange={setData} />
			)}
		</div>
	);
}
