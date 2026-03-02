import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import getSaves from "@/server/saves/getSaves.ts";

export const Route = createFileRoute("/saves/")({
  component: RouteComponent,
});

function RouteComponent() {
  const _saves = useQuery({
    queryKey: ["saves"],
    queryFn: () => getSaves({}),
  });

  return <div>Hello "/saves/"!</div>;
}
