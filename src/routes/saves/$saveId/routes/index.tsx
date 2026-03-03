import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import getSave from "@/server/saves/getSave.ts";
import getRoutes from "@/server/routes/getRoutes.ts";
import { Card, Menu, Progress, SimpleGrid, Stack, Text } from "@mantine/core";
import { Save } from "~/prisma/generated/client.ts";
import { BASE_NAME_FALLBACK_LABELS, groupRoutes } from "@/lib/groupRoutes.ts";

export const Route = createFileRoute("/saves/$saveId/routes/")({
  component: () => {
    const params = Route.useParams();

    if (!params.saveId) {
      throw new Error("saveId is required");
    }

    const saveId = Number(params.saveId);

    if (isNaN(saveId)) {
      throw new Error("saveId is required");
    }

    return <SaveRoutesPage saveId={saveId} />;
  },
});

type SavePageProps = {
  saveId: Save["id"];
};

type RouteEntry = Awaited<ReturnType<typeof getRoutes>>[number];

function RouteCard({
  route,
  saveId,
}: {
  route: RouteEntry;
  saveId: Save["id"];
}) {
  const navigate = useNavigate();
  const pct = route.totalSpecies > 0
    ? Math.round(route.caughtCount / route.totalSpecies * 100)
    : 0;

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() =>
        navigate({
          to: "/saves/$saveId/routes/$routeId",
          params: { saveId: String(saveId), routeId: String(route.id) },
        })}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Text fw={600} size="lg" truncate>
          {route.name}
        </Text>
      </Card.Section>
      <Stack mt="md" gap="xs">
        <Text size="sm" c="dimmed">
          {route.caughtCount}/{route.totalSpecies} caught
        </Text>
        <Progress value={pct} color={pct === 100 ? "green" : undefined} />
      </Stack>
    </Card>
  );
}

function stripParens(s: string): string {
  return s.replace(/^\(/, "").replace(/\)$/, "");
}

function GroupedRouteCard({
  baseName,
  routes,
  saveId,
}: {
  baseName: string;
  routes: RouteEntry[];
  saveId: Save["id"];
}) {
  const navigate = useNavigate();
  const totalSpecies = routes.reduce((sum, r) => sum + r.totalSpecies, 0);
  const caughtCount = routes.reduce((sum, r) => sum + r.caughtCount, 0);
  const pct = totalSpecies > 0
    ? Math.round(caughtCount / totalSpecies * 100)
    : 0;

  return (
    <Menu position="bottom-start" withArrow>
      <Menu.Target>
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ cursor: "pointer" }}
        >
          <Card.Section withBorder inheritPadding py="xs">
            <Text fw={600} size="lg" truncate>
              {baseName}
            </Text>
          </Card.Section>
          <Stack mt="md" gap="xs">
            <Text size="sm" c="dimmed">
              {caughtCount}/{totalSpecies} caught
            </Text>
            <Progress value={pct} color={pct === 100 ? "green" : undefined} />
          </Stack>
        </Card>
      </Menu.Target>
      <Menu.Dropdown>
        {routes.map((route) => {
          const suffix = route.name === baseName
            ? (BASE_NAME_FALLBACK_LABELS[baseName] ?? baseName)
            : stripParens(route.name.replace(baseName, "").trim());
          return (
            <Menu.Item
              key={route.id}
              onClick={() =>
                navigate({
                  to: "/saves/$saveId/routes/$routeId",
                  params: {
                    saveId: String(saveId),
                    routeId: String(route.id),
                  },
                })}
            >
              {suffix}
            </Menu.Item>
          );
        })}
      </Menu.Dropdown>
    </Menu>
  );
}

function SaveRoutesPage({ saveId }: Readonly<SavePageProps>) {
  const { data: save } = useQuery({
    queryKey: ["saves", { saveId }],
    queryFn: () => getSave({ data: { id: saveId } }),
  });

  const { data: routes = [], isLoading } = useQuery({
    queryKey: ["routes", save?.gameId, saveId],
    queryFn: () => getRoutes({ data: { gameId: save!.game.id, saveId } }),
    enabled: !!save,
    select: groupRoutes,
  });

  if (!save || isLoading) {
    return <Text c="dimmed">Loading routes...</Text>;
  }

  if (routes.length === 0) {
    return (
      <Card withBorder p="xl" ta="center">
        <Text c="dimmed">No routes found for this game.</Text>
      </Card>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
      {routes.map((item) =>
        item.kind === "single"
          ? <RouteCard key={item.route.id} route={item.route} saveId={saveId} />
          : (
            <GroupedRouteCard
              key={item.baseName}
              baseName={item.baseName}
              routes={item.routes}
              saveId={saveId}
            />
          )
      )}
    </SimpleGrid>
  );
}
