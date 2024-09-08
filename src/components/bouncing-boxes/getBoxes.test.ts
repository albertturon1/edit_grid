import { describe } from "node:test";
import { afterEach, expect, it, vi } from "vitest";
import * as getBoxesModule from "./getBoxes.js";

vi.mock("../../lib/utils", () => {
	return {
		getRandomSign: () => 1,
	};
});

describe("getBoxes function with mocked window dimensions", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	//test cases generated with LLM
	const testCases = [
		{
			input: { size: 40, speed: 2, gap: 5, width: 100, height: 100 },
			expected: [
				{ x: 5, y: 5, size: 40, vx: 2, vy: 2, id: 0 },
				{ x: 50, y: 5, size: 40, vx: 2, vy: 2, id: 1 },
				{ x: 5, y: 50, size: 40, vx: 2, vy: 2, id: 2 },
				{ x: 50, y: 50, size: 40, vx: 2, vy: 2, id: 3 },
			],
		},
		{
			input: { size: 20, speed: 1, gap: 10, width: 120, height: 120 },
			expected: [
				{ x: 10, y: 10, size: 20, vx: 1, vy: 1, id: 0 },
				{ x: 40, y: 10, size: 20, vx: 1, vy: 1, id: 1 },
				{ x: 70, y: 10, size: 20, vx: 1, vy: 1, id: 2 },
				{ x: 100, y: 10, size: 20, vx: 1, vy: 1, id: 3 },
				{ x: 10, y: 40, size: 20, vx: 1, vy: 1, id: 4 },
				{ x: 40, y: 40, size: 20, vx: 1, vy: 1, id: 5 },
				{ x: 70, y: 40, size: 20, vx: 1, vy: 1, id: 6 },
				{ x: 100, y: 40, size: 20, vx: 1, vy: 1, id: 7 },
				{ x: 10, y: 70, size: 20, vx: 1, vy: 1, id: 8 },
				{ x: 40, y: 70, size: 20, vx: 1, vy: 1, id: 9 },
				{ x: 70, y: 70, size: 20, vx: 1, vy: 1, id: 10 },
				{ x: 100, y: 70, size: 20, vx: 1, vy: 1, id: 11 },
				{ x: 10, y: 100, size: 20, vx: 1, vy: 1, id: 12 },
				{ x: 40, y: 100, size: 20, vx: 1, vy: 1, id: 13 },
				{ x: 70, y: 100, size: 20, vx: 1, vy: 1, id: 14 },
				{ x: 100, y: 100, size: 20, vx: 1, vy: 1, id: 15 },
			],
		},
	];

	testCases.forEach(({ input, expected }, idx) => {
		it(`Test case ${idx}: size=${input.size}, speed=${input.speed}, gap=${input.gap}`, async () => {
			// Call the function
			const result = getBoxesModule.getBoxes(input);

			// Assert that the result matches the expected output
			expect(result).toEqual(expected);
		});
	});
});
