import { ThemeProvider } from "@/components/theme-provider";
import type { PropsWithChildren } from "react";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: PropsWithChildren) {
	return (
		<>
			<ThemeProvider>{children}</ThemeProvider>
			<Toaster />
		</>
	);
}
