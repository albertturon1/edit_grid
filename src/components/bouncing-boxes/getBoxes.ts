import type { Box } from "@/components/bouncing-boxes/bouncing-boxes";
import { getRandomSign } from "@/lib/utils";

export function getBoxes({
  size,
  speed,
  gap,
  height,
  width,
}: {
  size: number;
  speed: number;
  gap: number;
  height: number;
  width: number;
}) {
  const newBoxes: Box[] = [];

  // Calculate how many boxes can fit horizontally and vertically
  const horizontalQuantity = Math.floor(width / (size + gap));
  const verticalQuantity = Math.floor(height / (size + gap));
  const quantity = horizontalQuantity * verticalQuantity;

  let row = 0;
  let column = 0;
  for (const id of Array.from({ length: quantity }, (_, i) => i)) {
    if (row >= horizontalQuantity) {
      //going to the next column and resetting rows
      column++;
      row = 0;
    }

    const x0 = row * (size + gap) + gap; // Shift by gap after every box
    const y0 = column * (size + gap) + gap;

    newBoxes.push({
      id,
      x: x0,
      y: y0,
      size,
      vx: speed * getRandomSign(),
      vy: speed * getRandomSign(),
    });

    row++;
  }

  return newBoxes;
}
