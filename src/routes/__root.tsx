import { lazy } from "react";
import { NotFound } from "@/components/not-found";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";

const RouterDevtools =
	process.env.NODE_ENV === "production"
		? () => null // Render nothing in production
		: lazy(() =>
				// Lazy load in development
				import("@tanstack/router-devtools").then((res) => ({
					default: res.TanStackRouterDevtools,
					// For Embedded Mode
					// default: res.TanStackRouterDevtoolsPanel
				})),
			);

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
			<RouterDevtools />
		</div>
	);
}
