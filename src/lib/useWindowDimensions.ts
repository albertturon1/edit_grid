import { useCallback, useState } from "react";
import { useEventListener } from "usehooks-ts";

export function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const handleResize = useCallback(() => {
		setWindowDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	}, []);

	useEventListener("resize", handleResize);

	return windowDimensions;
}
