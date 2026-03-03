import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import getSave from "@/server/saves/getSave.ts";
import getRoutes from "@/server/routes/getRoutes.ts";
import {
  Card,
  Group,
  Menu,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { Save } from "~/prisma/generated/client.ts";
import { groupRoutes } from "@/lib/groupRoutes.ts";
import getProgress from "../../../../server/saves/getProgress.ts";

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

  return (
    <Card
      style={{ cursor: "pointer" }}
      onClick={() =>
        navigate({
          to: "/saves/$saveId/routes/$routeId",
          params: { saveId: String(saveId), routeId: String(route.id) },
        })}
    >
      <Stack>
        <Group justify="space-between">
          <Text fw={600} size="lg" truncate>
            {route.name}
          </Text>
          <Text size="sm" color="dimmed">
            {route.caughtCount}/{route.totalSpecies} caught
          </Text>
        </Group>
        <Progress
          value={Math.round(route.caughtCount / route.totalSpecies * 100)}
          color={Math.round(
              route.caughtCount / route.totalSpecies * 100,
            ) ===
              100
            ? "green"
            : undefined}
        />
      </Stack>
    </Card>
  );
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

  return (
    <Menu position="bottom-start" withArrow>
      <Menu.Target>
        <Card
          style={{ cursor: "pointer" }}
        >
          <Stack>
            <Group justify="space-between">
              <Text fw={600} size="lg" truncate>
                {baseName}
              </Text>
              <Text size="sm" color="dimmed">
                {caughtCount} / {totalSpecies} caught
              </Text>
            </Group>
            <Progress
              value={Math.round(caughtCount / totalSpecies * 100)}
              color={Math.round(
                  caughtCount / totalSpecies * 100,
                ) ===
                  100
                ? "green"
                : undefined}
            />
          </Stack>
        </Card>
      </Menu.Target>
      <Menu.Dropdown>
        {routes.map((route) => (
          <Menu.Item
            key={route.id}
            leftSection={
              <RingProgress
                size={32}
                thickness={8}
                sections={[{
                  color: Math.round(
                      caughtCount / totalSpecies * 100,
                    ) ===
                      100
                    ? "green"
                    : "blue",
                  value: Math.round(caughtCount / totalSpecies * 100),
                }]}
              />
            }
            onClick={() =>
              navigate({
                to: "/saves/$saveId/routes/$routeId",
                params: {
                  saveId: String(saveId),
                  routeId: String(route.id),
                },
              })}
          >
            {route.name}
          </Menu.Item>
        ))}
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

  const { data: progress } = useQuery({
    queryKey: ["progress", { saveId }],
    queryFn: () => getProgress({ data: { saveId } }),
    staleTime: 0,
  });

  if (!save || isLoading) {
    return <Text c="dimmed">Loading routes...</Text>;
  }

  if (routes.length === 0) {
    return (
      <Card>
        <Text c="dimmed">No routes found for this game.</Text>
      </Card>
    );
  }

  const progressPct = progress && progress.totalSpecies > 0
    ? Math.round((progress.caught / progress.totalSpecies) * 100)
    : 0;

  return (
    <Stack>
      {progress && (
        <Card>
          <Stack>
            <Group justify="space-between" mb={4}>
              <Text fw={600} size="xl">
                Overall Progress
              </Text>
              <Text size="sm" c="dimmed">
                {progress.caught}/{progress.totalSpecies} caught
              </Text>
            </Group>
            <Progress value={progressPct} color="blue" />
          </Stack>
        </Card>
      )}
      <SimpleGrid cols={{ base: 2, md: 3, lg: 4 }}>
        {routes.map((item) =>
          item.kind === "single"
            ? (
              <RouteCard
                key={item.route.id}
                route={item.route}
                saveId={saveId}
              />
            )
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
    </Stack>
  );
}
