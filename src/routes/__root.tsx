import styles from "@/assets/styles.css?url";
import { createRootRoute } from "@tanstack/react-router";
import RootLayout from "@/components/Layouts/RootLayout.tsx";
import queryClient from "@/lib/queryClient.ts";
import theme from "@/lib/theme.ts";

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
        title: "Daphnes",
      },
    ],
    links: [
      { rel: "stylesheet", href: styles },
    ],
  }),
  component: () => <RootLayout queryClient={queryClient} theme={theme} />,
  notFoundComponent: () => <div>Not found</div>,
});
