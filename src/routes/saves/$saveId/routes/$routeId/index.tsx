import PokemonCard from "@/components/PokemonCard.tsx";
import getRoute from "@/server/routes/getRoute.ts";
import getRouteEncounters from "@/server/routes/getRouteEncounters.ts";
import { Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Route as PkRoute, Save } from "~/prisma/generated/client.ts";

export const Route = createFileRoute("/saves/$saveId/routes/$routeId/")({
  component: () => {
    const params = Route.useParams();

    if (!params.saveId) {
      throw new Error("saveId is required");
    }

    if (!params.routeId) {
      throw new Error("routeId is required");
    }

    const saveId = Number(params.saveId);

    if (isNaN(saveId)) {
      throw new Error("SaveId must be a number");
    }

    const routeId = Number(params.routeId);

    if (isNaN(routeId)) {
      throw new Error("RouteId must be a number");
    }

    return <SaveRoutePage saveId={saveId} routeId={routeId} />;
  },
});

export type SaveRoutePage = {
  saveId: Save["id"];
  routeId: PkRoute["id"];
};

function SaveRoutePage({ saveId, routeId }: Readonly<SaveRoutePage>) {
  const { data: route } = useQuery({
    queryKey: ["routes", { saveId, routeId }],
    queryFn: () => getRoute({ data: { routeId, saveId } }),
  });

  const { data: encounters = [], isLoading: encLoading } = useQuery({
    queryKey: ["routeEncounters", { routeId, saveId }],
    queryFn: () =>
      getRouteEncounters({
        data: { routeId, saveId },
      }),
    staleTime: 0,
  });

  return (
    <Stack>
      {/* Route header */}
      {route && (
        <Group justify="space-between" align="center">
          <Title order={3}>{route.name}</Title>
          <Text c="dimmed" size="sm">
            {route.caughtCount}/{route.totalSpecies} caught
          </Text>
        </Group>
      )}

      {/* Pokémon grid */}
      {encLoading && <Text c="dimmed">Loading encounters...</Text>}
      {!encLoading && encounters.length === 0 && (
        <Text c="dimmed">No encounters found for this route.</Text>
      )}
      <SimpleGrid cols={4}>
        {encounters.map((enc) => (
          <PokemonCard key={enc.species.id} entry={enc} saveId={saveId} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}
