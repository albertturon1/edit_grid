import {
	useEffect,
	useRef,
	useState,
	type Dispatch,
	type MutableRefObject,
} from "react";
import { BouncingBoxes } from "@/components/bouncing-boxes";
import {
	HeadlineWithPicker,
	type HeadlineWithPickerProps,
} from "./headline-picker";
import { getValueFromSystemTheme, useTheme } from "@/components/theme-provider";
import { throttle } from "@/lib/throttle";

type LandingProps = {
	onFileChange: HeadlineWithPickerProps["onFileChange"];
};

export function Landing({ onFileChange }: LandingProps) {
	const lastSquareSizeRef = useRef(window.innerHeight * window.innerWidth);
	const initialBoxesQuantity = getNumBoxes(lastSquareSizeRef.current);
	const [boxesQuantity, setBoxesQuantity] =
		useState<number>(initialBoxesQuantity);

	useOnScreenResize(lastSquareSizeRef, setBoxesQuantity);

	const { theme } = useTheme();

	const currentTheme = theme === "system" ? getValueFromSystemTheme() : theme;
	const boxesColor = currentTheme === "light" ? "#e3b1b5" : "#400C59";

	return (
		<div className="flex flex-1 relative">
			<BouncingBoxes
				quantity={boxesQuantity}
				size={40}
				speed={0.55}
				color={boxesColor}
			/>
			<HeadlineWithPicker onFileChange={onFileChange} />
		</div>
	);
}

function useOnScreenResize(
	lastSquareSizeRef: MutableRefObject<number>,
	onChange: Dispatch<React.SetStateAction<number>>,
) {
	useEffect(() => {
		function handleResize() {
			const squareSize = window.innerHeight * window.innerWidth;
			if (
				squareSize > lastSquareSizeRef.current * 0.95 ||
				squareSize < lastSquareSizeRef.current * 1.05
			) {
				lastSquareSizeRef.current = squareSize;
				onChange(getNumBoxes(squareSize));
			}
		}

		const throttledResize = throttle(handleResize, 1000);

		window.addEventListener("resize", throttledResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [lastSquareSizeRef, onChange]);
}

function getNumBoxes(squareSize: number) {
	return Math.floor(squareSize / 10000);
}
