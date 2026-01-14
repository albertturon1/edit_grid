import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

type HeadlineCsvExampleProps = {
	onLoad: (filepath: string) => void;
	children: ReactNode;
	filepath: string;
};

export function HeadlineCsvExample({
	onLoad,
	children,
	filepath,
}: HeadlineCsvExampleProps) {
	return (
		<Button variant={"outline"} onClick={() => onLoad(filepath)}>
			{children}
		</Button>
	);
}
