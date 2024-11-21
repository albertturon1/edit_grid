import { cn } from "@/lib/utils";
import React, {
	createContext,
	useContext,
	useRef,
	type ReactNode,
	type RefObject,
} from "react";
import * as Portal from "@radix-ui/react-portal";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";
import { useElementDimensions } from "@/lib/useElementDimenions";
import {
	useEventListener,
	useOnClickOutside,
	useWindowSize,
} from "usehooks-ts";

const KEY_NAME_ESC = "Escape";

export type ContextMenuPosition = {
	x: number;
	y: number;
};

function ContextMenu({
	onClose,
	children,
	position,
}: {
	onClose?: () => void;
	children: ReactNode;
	position: ContextMenuPosition | null;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const coordinates = useCoordinates(ref, position);

	useOnClickOutside(ref, () => {
		onClose?.();
	});

	function close(event: KeyboardEvent) {
		if (event.key === KEY_NAME_ESC) {
			onClose?.();
		}
	}

	useEventListener("keyup", close);

	return (
		<Portal.Root ref={ref} className={cn("fixed z-50")} style={coordinates}>
			{children}
		</Portal.Root>
	);
}

function useCoordinates(
	ref: RefObject<HTMLDivElement>,
	position: ContextMenuPosition | null,
) {
	const { width: screenWidth, height: screenHeight } = useWindowSize();
	const dimensions = useElementDimensions(ref);

	if (!position) {
		return {
			top: -1000,
			left: -1000,
		};
	}

	const leftOutOfScreen =
		!!dimensions && position.x + dimensions.width > screenWidth * 0.97;
	const topOutOfScreen =
		!!dimensions && position.y + dimensions.height > screenHeight * 0.97;

	const visibleLeft = leftOutOfScreen
		? position.x - dimensions.width
		: position.x;
	const visibleTop = topOutOfScreen
		? position.y - dimensions.height
		: position.y;

	return {
		top: visibleTop,
		left: visibleLeft,
	};
}

// Context to ensure ContextMenuItem is used inside ContextMenuContent
const ContextMenuContentContext = createContext<boolean | null>(null);

const ContextMenuContent = ({
	className,
	children,
}: { className?: string; children?: ReactNode }) => {
	return (
		<ContextMenuContentContext.Provider value={true}>
			<div
				className={cn(
					"z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					className,
				)}
			>
				{children}
			</div>
		</ContextMenuContentContext.Provider>
	);
};
ContextMenuContent.displayName = "ContextMenuContent";

function ContextMenuItem({
	className,
	onClick,
	children,
	inset,
}: {
	className?: string;
	onClick?: () => void;
	children: ReactNode;
	inset?: boolean;
}) {
	// Check if the item is used within ContextMenuContent
	const isInsideContextMenuContent = useContext(ContextMenuContentContext);

	if (!isInsideContextMenuContent) {
		throw new Error(
			"`ContextMenuItem` must be used within `ContextMenuContent`",
		);
	}

	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				"relative flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full",
				inset && "pl-8",
				className,
			)}
		>
			{children}
		</button>
	);
}
ContextMenuItem.displayName = "ContextMenuItem";

const ContextMenuSeparator = React.forwardRef<
	React.ElementRef<typeof ContextMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<ContextMenuPrimitive.Separator
		ref={ref}
		className={cn("-mx-1 my-1 h-px bg-border", className)}
		{...props}
	/>
));
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

export {
	ContextMenu,
	ContextMenuItem,
	ContextMenuContent,
	ContextMenuSeparator,
};
