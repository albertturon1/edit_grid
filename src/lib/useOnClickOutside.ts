import type { RefObject } from "react";
import { useEventListener } from "./useEventListener";

export function useOnClickOutside(
	ref: RefObject<HTMLElement>,
	callback: () => void,
) {
	function handleClickOutside(event: MouseEvent | TouchEvent) {
		if (ref.current && !ref.current.contains(event.target as Node)) {
			callback();
		}
	}

	useEventListener("mousedown", handleClickOutside);
}
