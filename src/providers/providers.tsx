import { ThemeProvider } from "@/components/theme-provider";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
	return <ThemeProvider>{children}</ThemeProvider>;
}
