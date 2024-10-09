import { useRef, type MouseEvent } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { HeadlineFilePicker } from "@/features/home/components/headline-file-picker";
import type {
	TableHeaders,
	TableRows,
} from "@/components/file-picker-import-dialog/mapHeadersToRows";
import type { ParseResult } from "papaparse";
import type { FilePickerCoreRef } from "../../../components/file-picker-core";
import { HeadlineCsvExample } from "./headline-csv-example";

export type OnFileImport = {
	file: File;
	headers: TableHeaders;
	rows: TableRows;
};

export type HeadlineWithPickerProps = {
	onFileImport: (props: OnFileImport) => void;
};

export type TemporalFileData = {
	file: File;
	result: Pick<ParseResult<unknown>, "errors" | "meta"> & {
		data: string[][];
	};
};

export function HeadlineWithPicker({
	onFileImport,
	...props
}: HeadlineWithPickerProps) {
	const { theme } = useTheme();
	const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;
	const overlayColor =
		currentTheme === "light" ? "bg-slate-100/10" : "bg-black/60";

	const inputRef = useRef<FilePickerCoreRef>(null);

	function handleOpen(e: MouseEvent<HTMLButtonElement>) {
		inputRef.current?.showFilePicker(e);
	}

	return (
		<div
			className={cn(
				"absolute z-10 top-0 right-0 left-0 bottom-0 flex flex-1 flex-col",
				overlayColor,
			)}
		>
			<div className="flex flex-1 bg-background opacity-30 absolute z-10 top-0 right-0 left-0 bottom-0" />
			<div className="z-10 flex flex-1 flex-col justify-between items-center backdrop-blur-3xl py-10">
				<div className="flex flex-col pb-[5%] flex-1 justify-center gap-y-10 px-3 sm:px-6">
					<Headline />
					<div className="flex justify-center items-center">
						<HeadlineFilePicker
							{...props}
							fileSizeLimit={{ size: 5, unit: "MB" }}
							inputRef={inputRef}
							onFileImport={onFileImport}
							onClick={handleOpen}
						/>
					</div>
				</div>
				<HeadlineCsvExample onFileImport={onFileImport} />
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
