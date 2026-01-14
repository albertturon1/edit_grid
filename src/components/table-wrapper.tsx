import { cn } from "@/lib/utils";
import { NAVBAR_HEIGHT } from "@/routes/__root";
import type { ReactNode } from "react";

interface TableWrapperProps {
	children: ReactNode;
	className?: string;
}

export function TableWrapper({ children, className }: TableWrapperProps) {
	return (
		<div
			className={cn("flex flex-col gap-y-10 justify-center", className)}
			style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
		>
			{children}
		</div>
	);
}
