import { useState } from "react";
import { useEventListener } from "./useEventListener";

export function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	function handleResize() {
		setWindowDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}

	useEventListener("resize", handleResize);

	return windowDimensions;
}
