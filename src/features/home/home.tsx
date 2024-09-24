import { useState } from "react";
import type { FilePickerRow } from "@/components/file-picker";
import { VirtualizedTable } from "@/components/virtualized-table/virtualized-table";
import { Landing } from "@/features/home/components/landing";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { useWindowDimensions } from "@/lib/useWindowDimensions";
import { useBlocker } from "@tanstack/react-router";

export function HomePage() {
	const [data, setData] = useState<FilePickerRow[]>([]);
	const [originalFilename, setOriginalFilename] = useState<string>("");
	const { height } = useWindowDimensions();

	// display alert before leaving this page
	useBlocker({
		condition: data.length > 0,
	});

	return (
		<div
			className="overflow-hidden flex flex-col gap-y-10"
			style={{
				height: height - NAVBAR_HEIGHT,
			}}
		>
			{data.length === 0 ? (
				<Landing
					onFileChange={({ filename, values }) => {
						setData(values);
						setOriginalFilename(filename);
					}}
				/>
			) : (
				<div className="w-full h-full px-5">
					<VirtualizedTable
						data={data}
						originalFilename={originalFilename}
						onDataChange={setData}
					/>
				</div>
			)}
		</div>
	);
}
