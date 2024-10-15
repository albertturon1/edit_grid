import { useEventListener } from "@/lib/useEventListener";
import { useState, useCallback } from "react";

export function useContextMenu() {
	const [position, setPosition] = useState({ x: 0, y: 0 });

	const openContextMenu = useCallback((event: MouseEvent) => {
		event.preventDefault();
		setPosition({ x: event.clientX, y: event.clientY });
	}, []);

	useEventListener("contextmenu", openContextMenu);

	return position;
}
