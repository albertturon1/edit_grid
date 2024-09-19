import { BouncingBoxes } from "@/components/bouncing-boxes/bouncing-boxes";
import {
	HeadlineWithPicker,
	type HeadlineWithPickerProps,
} from "@/features/home/components/headline-picker";
// import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";

type LandingProps = {
	onFileChange: HeadlineWithPickerProps["onFileChange"];
};

export function Landing({ onFileChange }: LandingProps) {
	// const { theme } = useTheme();
	// const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;
	// const boxesColor = currentTheme === "light" ? "#e3b1b5" : "#400C59";

	return (
		<div className="flex flex-1 relative">
			<BouncingBoxes size={50} speed={1} gap={25} />
			<HeadlineWithPicker onFileChange={onFileChange} />
		</div>
	);
}
