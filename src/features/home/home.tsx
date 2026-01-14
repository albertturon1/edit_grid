import { useRef } from "react";
import { BouncingBoxes } from "@/components/bouncing-boxes/bouncing-boxes";
import type { FilePickerCoreRef } from "@/components/file-picker-core";
import { Logo } from "@/components/logo";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import { HeadlineFilePicker } from "./components/headline-file-picker";
import { useFileImport } from "./hooks/useFileImport";
import { Button } from "@/components/ui/button";

export function HomePage() {
	const inputRef = useRef<FilePickerCoreRef>(null);
	const { theme } = useTheme();
	const { importFile, importExample } = useFileImport();

	const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;

	const overlayClass =
		currentTheme === "light" ? "bg-slate-100/10" : "bg-black/60";

	return (
		<div
			className="flex flex-col overflow-hidden gap-y-10"
			style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
		>
			<div className="relative flex flex-1">
				{/* Background */}
				<BouncingBoxes size={50} speed={1} gap={25} />

				{/* Overlay */}
				<div
					className={cn("absolute inset-0 z-10 flex flex-col", overlayClass)}
				>
					<div className="absolute inset-0 z-10 bg-background opacity-30" />

					{/* Content */}
					<div className="z-20 flex flex-1 flex-col items-center justify-between backdrop-blur-3xl py-10">
						{/* Hero */}
						<div className="flex flex-1 flex-col justify-center gap-y-10 px-3 pb-[5%] sm:px-6">
							<div className="flex flex-col items-center gap-y-1 text-center">
								<div className="flex flex-wrap items-center justify-center text-3xl font-bold">
									<h1>Welcome to&nbsp;</h1>
									<Logo className="text-3xl" />
								</div>
								<h2 className="text-xl font-medium">
									Your Ultimate Online Worksheet Editor
								</h2>
							</div>

							<div className="flex justify-center">
								<HeadlineFilePicker
									inputRef={inputRef}
									filePickerOptions={{
										fileSizeLimit: { size: 5, unit: "MB" },
									}}
									onFileImport={importFile}
									onClick={(e) => {
										inputRef.current?.showFilePicker(e);
									}}
								/>
							</div>
						</div>

						{/* Examples */}
						<div className="flex flex-col gap-y-2 md:flex-row md:gap-x-5">
							<Button
								variant={"outline"}
								onClick={() => {
									importExample("/example_big.csv");
								}}
							>
								Open example file
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
