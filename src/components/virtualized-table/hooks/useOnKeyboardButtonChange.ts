import { useEffect } from "react";
import { useDetectOS } from "./useDetectOS";

export function useOnKeyboardButtonChange(modifiers: {
	os?: ("mac" | "linux" | "windows")[];
	key: string;
	onKeyUp?: () => void;
	onKeyDown?: () => void;
}) {
	const userOS = useDetectOS();

	useEffect(() => {
		const { key, os, onKeyDown, onKeyUp } = modifiers;
		const getIsModifierPressed = (event: KeyboardEvent) => {
			const isKeyEqual = event.key === key;
			const isOsEqual = os ? os.some((o) => o === userOS) : true;

			return isKeyEqual && isOsEqual;
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (getIsModifierPressed(event)) {
				onKeyDown?.();
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			if (getIsModifierPressed(event)) {
				onKeyUp?.();
			}
		};

		// Add event listeners for keydown and keyup
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		// Cleanup event listeners when component unmounts
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [modifiers, userOS]);
}
