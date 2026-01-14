import { BouncingBoxes } from "@/components/bouncing-boxes/bouncing-boxes";
import {
	HeadlineWithPicker,
	type HeadlineWithPickerProps,
} from "@/features/home/components/headline-picker";

type LandingProps = {
	onFileImport: HeadlineWithPickerProps["onFileImport"];
	onLoadExample: HeadlineWithPickerProps["onLoadExample"];
};

export function Landing({ onFileImport, onLoadExample }: LandingProps) {
	return (
		<div className="flex flex-1 relative">
			<BouncingBoxes size={50} speed={1} gap={25} />
			<HeadlineWithPicker
				onFileImport={onFileImport}
				onLoadExample={onLoadExample}
			/>
		</div>
	);
}
