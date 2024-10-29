import { useEffect, useRef } from "react";

// biome-ignore lint/suspicious/noExplicitAny: generic
export function useAnimationFrame(callback: (...args: any[]) => any) {
	// Use useRef for mutable variables that we want to persist
	// without triggering a re-render on their change
	const requestRef = useRef<number>();
	const previousTimeRef = useRef<number>();

	const animate = (time: number) => {
		if (previousTimeRef.current !== undefined) {
			const deltaTime = time - previousTimeRef.current;
			callback(deltaTime);
		}
		previousTimeRef.current = time;
		requestRef.current = requestAnimationFrame(animate);
	};

	useEffect(() => {
		requestRef.current = requestAnimationFrame(animate);

		//@ts-expect-error
		return () => cancelAnimationFrame(requestRef.current);
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	}, [animate]);
}
