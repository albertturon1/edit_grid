import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useNavigate } from "@tanstack/react-router";
import { Logo } from "@/components/logo";

type NavbarProps = {
	height: number;
};

export function Navbar({ height }: NavbarProps) {
	const navigate = useNavigate();

	return (
		<div
			className="flex flex-1 fixed top-0 w-full items-center justify-between border-b border-border px-5 bg-background z-20"
			style={{
				height,
			}}
		>
			<button
				onClick={() => {
					navigate({
						to: "/",
					});
				}}
				type="button"
			>
				<Logo />
			</button>
			<ThemeToggle />
		</div>
	);
}
