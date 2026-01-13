import { forwardRef } from "react";
import { Button, type ButtonProperties } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonPropertiesProps extends ButtonProperties {
	active?: boolean;
}

// forwardRef explained https://www.radix-ui.com/primitives/docs/guides/composition#composing-with-your-own-react-components
export const TableDropdownButton = forwardRef<
	HTMLButtonElement,
	ButtonPropertiesProps
>(({ active, children, className, ...props }, forwardedRef) => {
	return (
		<Button
			{...props}
			ref={forwardedRef}
			variant="outline"
			className={cn(
				"flex gap-x-2 sm:gap-x-3 sm:w-max justify-between px-2.5 py-2",
				active ? "bg-accent" : "",
				className,
			)}
		>
			{children}
		</Button>
	);
});
