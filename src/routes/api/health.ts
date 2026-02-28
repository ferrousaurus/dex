import { createFileRoute } from "@tanstack/react-router";
import { getHealth } from "@/api/health/getHealth.ts";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: getHealth,
    },
  },
});
