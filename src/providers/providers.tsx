import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
	return (
		<>
			<ThemeProvider>{children}</ThemeProvider>
			<Toaster />
		</>
	);
}
