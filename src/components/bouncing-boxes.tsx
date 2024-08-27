import { useRef, useEffect, useState } from "react";

// Utility function to detect collision between two boxes
const isColliding = (box1: Box, box2: Box) => {
	return !(
		box1.x + box1.size < box2.x ||
		box1.x > box2.x + box1.size ||
		box1.y + box1.size < box2.y ||
		box1.y > box2.y + box2.size
	);
};

type Box = {
	idx: number;
	x: number;
	y: number;
	size: number;
	vx: number;
	vy: number;
};

// Utility function to handle bouncing
const handleCollision = (box1: Box, box2: Box) => {
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

		const normalize = (vx: number, vy: number) => Math.sqrt(vx * vx + vy * vy);
		const magnitude1 = normalize(box1.vx, box1.vy);
		const magnitude2 = normalize(box2.vx, box2.vy);

		const newVx1 =
			(box1.vx - 2 * dotProduct * normalX) *
			(magnitude1 /
				normalize(
					box1.vx - 2 * dotProduct * normalX,
					box1.vy - 2 * dotProduct * normalY,
				));
		const newVy1 =
			(box1.vy - 2 * dotProduct * normalY) *
			(magnitude1 /
				normalize(
					box1.vx - 2 * dotProduct * normalX,
					box1.vy - 2 * dotProduct * normalY,
				));
		const newVx2 =
			(box2.vx + 2 * dotProduct * normalX) *
			(magnitude2 /
				normalize(
					box2.vx + 2 * dotProduct * normalX,
					box2.vy + 2 * dotProduct * normalY,
				));
		const newVy2 =
			(box2.vy + 2 * dotProduct * normalY) *
			(magnitude2 /
				normalize(
					box2.vx + 2 * dotProduct * normalX,
					box2.vy + 2 * dotProduct * normalY,
				));

		box1.vx = newVx1;
		box1.vy = newVy1;
		box2.vx = newVx2;
		box2.vy = newVy2;
	}
};

const Box = ({ x, y, size, color }: Box & { color: string }) => (
	<div
		className="absolute rounded"
		style={{
			left: x,
			top: y,
			width: size,
			height: size,
			backgroundColor: color,
		}}
	/>
);

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomSign() {
	return Math.random() < 0.5 ? -1 : 1;
}

type BouncingBoxesProps = {
	quantity: number;
	size?: number;
	speed?: number;
	color: string;
};

export const BouncingBoxes = ({
	quantity,
	size = 40,
	speed = 0.4,
	color,
}: BouncingBoxesProps) => {
	const canvasRef = useRef(null);
	const [boxes, setBoxes] = useState<Box[]>([]);

	useEffect(() => {
		const minX = window.innerWidth * 0.1;
		const maxX = window.innerWidth - size;
		const minY = window.innerHeight * 0.1;
		const maxY = window.innerHeight - size - 200;
		const newBoxes: Box[] = [];

		let idx = 0;
		while (newBoxes.length < quantity) {
			let validPosition = false;
			let x: number;
			let y: number;

			while (!validPosition) {
				x = getRandomInt(minX, maxX);
				y = getRandomInt(minY, maxY);

				const newBox = {
					idx,
					x,
					y,
					size,
					vx: speed * getRandomSign(),
					vy: speed * getRandomSign(),
				};

				const isValidBox = newBoxes.every((e) => {
					return !isColliding(newBox, e);
				});

				if (isValidBox) {
					validPosition = true;
					newBoxes.push(newBox);
					idx++;
				}
			}
		}
		setBoxes(newBoxes);
	}, [quantity, size, speed]);

	useEffect(() => {
		const update = () => {
			setBoxes((prev) => {
				const newBoxes = prev.map((box) => ({ ...box }));
				const canvasWidth = window.innerWidth;
				const canvasHeight = window.innerHeight;

				for (const box of newBoxes) {
					// Move box
					box.x += box.vx;
					box.y += box.vy;

					// Bounce off walls
					if (box.x <= 0 || box.x + box.size >= canvasWidth) box.vx *= -1;
					if (box.y <= 0 || box.y + box.size >= canvasHeight) box.vy *= -1;

					// Check collisions with other boxes
					for (const otherBox of newBoxes) {
						if (box !== otherBox && isColliding(box, otherBox)) {
							handleCollision(box, otherBox);
						}
					}
				}

				return newBoxes;
			});

			requestAnimationFrame(update);
		};

		update();

		return () => cancelAnimationFrame(0);
	}, []);

	return (
		<div ref={canvasRef} className="h-full w-full">
			{boxes.map((box, index) => (
				<Box key={box.idx} {...box} color={color} />
			))}
		</div>
	);
};
