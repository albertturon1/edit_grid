import type { Box } from "@/components/bouncing-boxes/bouncing-boxes";

const normalize = (vx: number, vy: number) => Math.sqrt(vx * vx + vy * vy);

export function handleCollision(box1: Box, box2: Box) {
  const dx = box1.x - box2.x;
  const dy = box1.y - box2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const combinedSize = (box1.size + box2.size) / 2;

  if (distance < combinedSize) {
    const overlap = combinedSize - distance;
    const normalX = dx / distance;
    const normalY = dy / distance;

    box1.x += (normalX * overlap) / 2;
    box1.y += (normalY * overlap) / 2;
    box2.x -= (normalX * overlap) / 2;
    box2.y -= (normalY * overlap) / 2;

    const relativeVx = box1.vx - box2.vx;
    const relativeVy = box1.vy - box2.vy;
    const dotProduct = relativeVx * normalX + relativeVy * normalY;

    const magnitude1 = normalize(box1.vx, box1.vy);
    const magnitude2 = normalize(box2.vx, box2.vy);

    const newVx1 =
      (box1.vx - 2 * dotProduct * normalX) *
      (magnitude1 /
        normalize(box1.vx - 2 * dotProduct * normalX, box1.vy - 2 * dotProduct * normalY));
    const newVy1 =
      (box1.vy - 2 * dotProduct * normalY) *
      (magnitude1 /
        normalize(box1.vx - 2 * dotProduct * normalX, box1.vy - 2 * dotProduct * normalY));
    const newVx2 =
      (box2.vx + 2 * dotProduct * normalX) *
      (magnitude2 /
        normalize(box2.vx + 2 * dotProduct * normalX, box2.vy + 2 * dotProduct * normalY));
    const newVy2 =
      (box2.vy + 2 * dotProduct * normalY) *
      (magnitude2 /
        normalize(box2.vx + 2 * dotProduct * normalX, box2.vy + 2 * dotProduct * normalY));

    box1.vx = newVx1;
    box1.vy = newVy1;
    box2.vx = newVx2;
    box2.vy = newVy2;
  }
}

// Utility function to detect collision between two boxes
export function isColliding(box1: Box, box2: Box) {
  return !(
    box1.x + box1.size < box2.x ||
    box1.x > box2.x + box1.size ||
    box1.y + box1.size < box2.y ||
    box1.y > box2.y + box2.size
  );
}
