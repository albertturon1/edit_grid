import { useState } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { FilePicker } from "@/features/home/components/filepicker/file-picker";
import { ImportSettingsDialog } from "@/features/home/components/filepicker/import-settings-dialog";
import {
	mapHeadersToRows,
	type TableHeaders,
	type TableRows,
} from "@/features/home/utils/mapHeadersToRows";
import type { ParseResult } from "papaparse";
import { z } from "zod";
import toast from "react-hot-toast";

export type HeadlineWithPickerProps = {
	onFileImport: (props: {
		file: File;
		headers: TableHeaders;
		rows: TableRows;
	}) => void;
};

type TemporalFileData = {
	file: File;
	result: Pick<ParseResult<unknown>, "errors" | "meta"> & {
		data: string[][];
	};
};

const dataSchema = z.array(z.array(z.string())).min(1);

export function HeadlineWithPicker({ onFileImport }: HeadlineWithPickerProps) {
	const { theme } = useTheme();
	const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;
	const overlayColor =
		currentTheme === "light" ? "bg-slate-100/10" : "bg-black/60";

	const [imported, setImported] = useState<TemporalFileData | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	function onSubmitSetData(
		file: File,
		data: string[][],
		fromRow: number,
		firstRowAsHeaders: boolean,
	) {
		{
			const { headers, rows } = mapHeadersToRows(
				data,
				firstRowAsHeaders,
				fromRow,
			);

			onFileImport({
				file,
				headers,
				rows,
			});

			setDialogOpen(false);
		}
	}

	function onFileSelect({
		file,
		result,
	}: { file: File; result: ParseResult<unknown> }) {
		const parsedResult = dataSchema.safeParse(result.data);

		if (!parsedResult.success) {
			toast.error(
				"Cannot use provided file!\n\nTry again with a different file.",
				{
					className: "text-sm",
					duration: 5000,
				},
			);
			return;
		}

		setImported({
			file,
			result: {
				...result,
				data: parsedResult.data,
			},
		});
		setDialogOpen(true);
	}

	function onCancel() {
		setDialogOpen(false);
	}

	return (
		<div
			className={cn(
				"absolute z-10 top-0 right-0 left-0 bottom-0 flex flex-1 flex-col",
				overlayColor,
			)}
		>
			<div className="flex flex-1 bg-background opacity-50" />
			<div className="absolute z-10 top-0 right-0 left-0 bottom-0 flex flex-1 flex-col justify-center items-center gap-y-10 px-3 sm:px-6 backdrop-blur-3xl pb-[5%]">
				<Headline />
				<div className="flex justify-center items-center">
					<FilePicker
						onFileSelect={onFileSelect}
						fileSizeLimit={{ size: 5, unit: "MB" }}
						accept={{
							".csv": true,
						}}
					/>
					{imported ? (
						<ImportSettingsDialog
							dataLength={imported.result.data.length}
							open={dialogOpen}
							onOpenChange={setDialogOpen}
							onCancel={onCancel}
							onSubmit={(importSettings) => {
								onSubmitSetData(
									imported.file,
									imported.result.data,
									importSettings.fromRow,
									importSettings.firstRowAsHeaders,
								);

								setDialogOpen(false);
							}}
						/>
					) : null}
				</div>
			</div>
		</div>
	);
}

function Headline() {
	return (
		<div className="text-center flex flex-col justify-center items-center gap-y-1">
			<div className="flex justify-center items-center font-bold text-3xl flex-wrap">
				<h1>{"Welcome to"}&nbsp;</h1>
				<Logo className="text-3xl" />
			</div>
			<h1 className="font-medium text-xl">
				{"Your Ultimate Online Worksheet Editor"}
			</h1>
		</div>
	);
}
