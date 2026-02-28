import Shell from "@/components/Shell/index.tsx";
import {
  ColorSchemeScript,
  createTheme,
  mantineHtmlProps,
  MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { FormDevtoolsPanel } from "@tanstack/react-form-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export type RootLayoutProps = {
  queryClient: QueryClient;
  theme: ReturnType<typeof createTheme>;
};

export default function RootLayout(
  { queryClient, theme }: Readonly<RootLayoutProps>,
) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <HeadContent />
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider theme={theme} defaultColorScheme="auto">
            <ModalsProvider>
              <Shell>
                <Outlet />
              </Shell>
              <Notifications />
            </ModalsProvider>
          </MantineProvider>
          <TanStackDevtools
            plugins={[
              {
                name: "Query",
                render: <ReactQueryDevtoolsPanel />,
                defaultOpen: true,
              },
              {
                name: "Router",
                render: <TanStackRouterDevtoolsPanel />,
                defaultOpen: false,
              },
              {
                name: "Form",
                render: <FormDevtoolsPanel />,
                defaultOpen: false,
              },
            ]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
