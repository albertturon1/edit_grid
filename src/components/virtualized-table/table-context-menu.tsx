import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "@/components/context-menu/context-menu";
import { ArrowBigDown, ArrowBigRight } from "lucide-react";
import type { ComponentProps } from "react";

export function TableContextMenu(
	props: Omit<ComponentProps<typeof ContextMenu>, "children">,
) {
	return (
		<ContextMenu {...props}>
			<ContextMenuContent className="[&>*]:gap-x-8 z-50">
				<ContextMenuItem className="justify-between">
					{"Add a row below"}
					<ArrowBigDown className="w-5 h-5" strokeWidth={0.7} />
				</ContextMenuItem>
				<ContextMenuSeparator />
				<ContextMenuItem className="justify-between">
					{"Add a column on the right"}
					<ArrowBigRight className="w-5 h-5" strokeWidth={0.7} />
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
