import { useEffect, useState } from "react";
import { getBoxes } from "@/components/bouncing-boxes/getBoxes";
import { useAnimationFrame } from "@/hooks/useAnimationFrame";
import { useWindowSize } from "usehooks-ts";
// import { handleCollision, isColliding } from "./handleCollision";

export type Box = {
	id: number;
	x: number;
	y: number;
	size: number;
	vx: number;
	vy: number;
};

type BouncingBoxesProps = {
	size: number;
	gap: number;
	speed: number;
	color?: string;
};

const WALL_GAP = 0.005;

export function BouncingBoxes({ size, speed, color, gap }: BouncingBoxesProps) {
	const { height, width } = useWindowSize();
	const [boxes, setBoxes] = useState<Box[]>([]);

	//generate new boxes on resize
	useEffect(() => {
		setBoxes(
			getBoxes({
				size,
				speed,
				gap,
				height,
				width,
			}),
		);
	}, [size, speed, gap, width, height]);

	//updated boxes positions on animation frame and handle collisions
	function updateBoxesPositions() {
		setBoxes((prev) => {
			const newBoxes = prev.map((box) => ({ ...box }));

			for (const box of newBoxes) {
				// Move box
				box.x += box.vx;
				box.y += box.vy;

				// Bounce off walls
				if (
					box.x <= width * WALL_GAP ||
					box.x + box.size >= width * 1 - WALL_GAP
				) {
					box.vx *= -1;
				}

				if (
					box.y <= height * WALL_GAP ||
					box.y + box.size >= height * 1 - WALL_GAP
				) {
					box.vy *= -1;
				}

				// Check collisions with other boxes
				// for (const otherBox of newBoxes) {
				// 	if (box !== otherBox && isColliding(box, otherBox)) {
				// 		handleCollision(box, otherBox);
				// 	}
				// }
			}

			return newBoxes;
		});
	}

	useAnimationFrame(updateBoxesPositions);

	return (
		<div className="flex-1">
			{boxes.map((box) => (
				<Box key={box.id} {...box} color={color} />
			))}
		</div>
	);
}

function Box({ x, y, size, color }: Box & { color: string | undefined }) {
	const [backgroundColor] = useState(
		color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
	);

	return (
		<div
			className="absolute rounded-full"
			style={{
				left: x,
				top: y,
				width: size,
				height: size,
				backgroundColor,
			}}
		/>
	);
}
