import { NotFound } from "@/components/not-found";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
	component: RootComponent,
	notFoundComponent: NotFound,
});

export const NAVBAR_HEIGHT = 60;

function RootComponent() {
	return (
		<div>
			<Navbar height={NAVBAR_HEIGHT} />
			<div
				style={{
					paddingTop: NAVBAR_HEIGHT,
				}}
			>
				<Link to="/" className="[&.active]:font-bold" />
				<Outlet />
			</div>
			<TanStackRouterDevtools />
		</div>
	);
}
