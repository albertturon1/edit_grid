import { useRef, useEffect, useState } from "react";
import { handleCollision, isColliding } from "./handleCollision";
import { getBoxes } from "./getBoxes";
import { useAnimationFrame } from "@/lib/useAnimationFrame";

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
	color: string;
};

type Dimensions = { width: number; height: number };

const WALL_GAP = 0.0;

export function BouncingBoxes({ size, speed, color, gap }: BouncingBoxesProps) {
	const ref = useRef<HTMLDivElement>(null); // Create a reference to the DOM element
	const [dimensions, setDimensions] = useState<Dimensions>({
		width: 0,
		height: 0,
	});
	const [boxes, setBoxes] = useState<Box[]>([]);

	//generate new boxes on resize
	useEffect(() => {
		setBoxes(() =>
			getBoxes({
				size,
				speed,
				gap,
				height: dimensions.height,
				width: dimensions.width,
			}),
		);
	}, [size, speed, gap, dimensions]);

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
					box.x <= dimensions.width * WALL_GAP ||
					box.x + box.size >= dimensions.width * 1 - WALL_GAP
				) {
					box.vx *= -1;
				}

				if (
					box.y <= dimensions.height * WALL_GAP ||
					box.y + box.size >= dimensions.height * 1 - WALL_GAP
				) {
					box.vy *= -1;
				}

				// Check collisions with other boxes
				for (const otherBox of newBoxes) {
					if (box !== otherBox && isColliding(box, otherBox)) {
						handleCollision(box, otherBox);
					}
				}
			}

			return newBoxes;
		});
	}

	useAnimationFrame(updateBoxesPositions);

	//update div dimensions
	useEffect(() => {
		const updateDimensions = () => {
			if (ref.current) {
				setDimensions({
					width: ref.current.offsetWidth,
					height: ref.current.offsetHeight,
				});
			}
		};

		// Call once on mount
		updateDimensions();

		// Optionally listen to window resize events
		window.addEventListener("resize", updateDimensions);

		// Cleanup the event listener
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	return (
		<>
			<h1 className="absolute z-10">{boxes.length}</h1>
			<div ref={ref} className="h-full w-full">
				{boxes.map((box) => (
					<Box key={box.id} {...box} color={color} />
				))}
			</div>
		</>
	);
}

function Box({ x, y, size, color }: Box & { color: string }) {
	return (
		<div
			className="absolute rounded-full"
			style={{
				left: x,
				top: y,
				width: size,
				height: size,
				backgroundColor: color,
			}}
		/>
	);
}
