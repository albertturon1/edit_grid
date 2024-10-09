import { useRef, type MouseEvent } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { FilePicker } from "@/features/home/components/filepicker/file-picker";
import type {
	TableHeaders,
	TableRows,
} from "@/features/home/utils/mapHeadersToRows";
import type { ParseResult } from "papaparse";
import type { FilePickerCoreRef } from "./filepicker/file-picker-core";

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

export function HeadlineWithPicker({ onFileImport }: HeadlineWithPickerProps) {
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
			<div className="flex flex-1 bg-background opacity-50" />
			<div className="absolute z-10 top-0 right-0 left-0 bottom-0 flex flex-1 flex-col justify-center items-center gap-y-10 px-3 sm:px-6 backdrop-blur-3xl pb-[5%]">
				<Headline />
				<div className="flex justify-center items-center">
					<FilePicker
						fileSizeLimit={{ size: 5, unit: "MB" }}
						inputRef={inputRef}
						onFileImport={onFileImport}
						onClick={handleOpen}
					/>
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
