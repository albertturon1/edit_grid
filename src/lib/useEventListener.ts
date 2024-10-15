import { useEffect } from "react";

export function useEventListener<T extends keyof DocumentEventMap>(
	eventType: T,
	callback: (event: DocumentEventMap[T]) => void,
	options?: AddEventListenerOptions,
) {
	useEffect(() => {
		const handler = (event: DocumentEventMap[T]) => {
			callback(event);
		};

		document.addEventListener(eventType, handler, options);

		return () => {
			document.removeEventListener(eventType, handler, options);
		};
	}, [eventType, callback, options]);
}
