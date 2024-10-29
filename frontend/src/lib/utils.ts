import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getRandomSign() {
	return Math.random() < 0.5 ? -1 : 1;
}

export function splitOnLastOccurrence(
	str: string,
	separator: string,
): [string, string] {
	const lastIndex = str.lastIndexOf(separator);

	if (lastIndex === -1) {
		return [str, ""]; // If separator is not found, return the original string and an empty string.
	}

	const before = str.slice(0, lastIndex);
	const after = str.slice(lastIndex + separator.length);

	return [before, after];
}
