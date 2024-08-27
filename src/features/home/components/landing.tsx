import {} from "react";
import {
	HeadlineWithPicker,
	type HeadlineWithPickerProps,
} from "./headline-picker";

type LandingProps = {
	onFileChange: HeadlineWithPickerProps["onFileChange"];
};

export function Landing({ onFileChange }: LandingProps) {
	return (
		<div className="flex flex-1 relative">
			<HeadlineWithPicker onFileChange={onFileChange} />
		</div>
	);
}
