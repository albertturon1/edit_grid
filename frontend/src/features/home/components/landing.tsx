import { BouncingBoxes } from "@/components/bouncing-boxes/bouncing-boxes";
import {
	HeadlineWithPicker,
	type HeadlineWithPickerProps,
} from "@/features/home/components/headline-picker";

type LandingProps = {
	onFileImport: HeadlineWithPickerProps["onFileImport"];
};

export function Landing({ onFileImport }: LandingProps) {
	return (
		<div className="flex flex-1 relative">
			<BouncingBoxes size={50} speed={1} gap={25} />
			<HeadlineWithPicker onFileImport={onFileImport} />
		</div>
	);
}
