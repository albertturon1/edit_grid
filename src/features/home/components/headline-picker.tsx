import { useRef, type MouseEvent } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { HeadlineFilePicker } from "@/features/home/components/headline-file-picker";
import type { FilePickerCoreRef } from "@/components/file-picker-core";
import { HeadlineCsvExample } from "@/features/home/components/headline-csv-example";
import type { FileImportResult } from "@/lib/imports/types/import";

export type HeadlineWithPickerProps = {
	onFileImport: (props: FileImportResult) => void;
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
			<div className="flex flex-1 bg-background opacity-30 absolute z-10 top-0 right-0 left-0 bottom-0" />
			<div className="z-10 flex flex-1 flex-col justify-between items-center backdrop-blur-3xl py-10">
				<div className="flex flex-col pb-[5%] flex-1 justify-center gap-y-10 px-3 sm:px-6">
					<Headline />
					<div className="flex justify-center items-center">
						<HeadlineFilePicker
							filePickerOptions={{
								fileSizeLimit: { size: 5, unit: "MB" },
							}}
							inputRef={inputRef}
							onFileImport={onFileImport}
							onClick={handleOpen}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-y-2 md:flex-row gap-x-5">
					<HeadlineCsvExample
						onFileImport={onFileImport}
						filepath="/example_medium.csv"
					>
						{"Open example file"}
					</HeadlineCsvExample>
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