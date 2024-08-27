// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function throttle<T extends (...args: any[]) => any>(
	func: T,
	limit: number,
): T {
	let inThrottle: boolean;

	return function (this: unknown, ...args: Parameters<T>): void {
		if (!inThrottle) {
			func.apply(this, args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	} as T;
}
