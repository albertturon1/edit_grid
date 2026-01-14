import { NotFound } from "@/components/not-found";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

export const NAVBAR_HEIGHT = 60;

function RootComponent() {
  return (
    <div className="min-h-dvh w-full">
      <Navbar height={NAVBAR_HEIGHT} />

      <div className="min-h-dvh flex flex-col" style={{ paddingTop: NAVBAR_HEIGHT }}>
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </div>
  );
}
