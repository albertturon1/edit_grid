import { NotFound } from "@/components/not-found";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanStackDevtools } from "@tanstack/react-devtools";
import appCss from "../index.css?url";
import { Providers } from "@/providers/providers";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Edit Grid",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
});

export const NAVBAR_HEIGHT = 60;

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Providers>
          <div className="min-h-dvh w-full">
            <Navbar height={NAVBAR_HEIGHT} />

            <div
              className="flex flex-col min-h-[calc(100dvh-60px)]"
              style={{
                paddingTop: NAVBAR_HEIGHT,
              }}
            >
              {children}
            </div>
          </div>
        </Providers>

        {import.meta.env.DEV && (
          <>
            <TanStackDevtools
              config={{
                position: "bottom-right",
              }}
              plugins={[
                {
                  name: "Tanstack Router",
                  render: <TanStackRouterDevtoolsPanel />,
                },
              ]}
            />
          </>
        )}
        <Scripts />
      </body>
    </html>
  );
}
