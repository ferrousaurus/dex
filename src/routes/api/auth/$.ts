import { auth } from "@/lib/auth.ts";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) =>
        await auth.handler(request),
      POST: async ({ request }: { request: Request }) =>
        await auth.handler(request),
    },
  },
});
