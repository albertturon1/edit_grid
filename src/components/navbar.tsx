import { useNavigate, useRouter } from "@tanstack/react-router";
import { Logo } from "@/components/logo";
// import { ThemeToggle } from "@/components/ui/theme-toggle";

type NavbarProps = {
	height: number;
};

export function Navbar({ height }: NavbarProps) {
	const navigate = useNavigate();
	const router = useRouter();

	function goToIndexPage() {
		if (router.state.location.pathname === "/") {
			router.history.go(0);
		} else {
			navigate({
				to: "/",
			});
		}
	}

	return (
		<div
			className="flex flex-1 fixed top-0 w-full items-center justify-between border-b border-border px-3 sm:px-5 bg-background z-20"
			style={{
				height,
			}}
		>
			<button type="button" onClick={goToIndexPage}>
				<Logo />
			</button>
			{/* <div className="flex items-center gap-3">
				<ThemeToggle />
			</div> */}
		</div>
	);
}
