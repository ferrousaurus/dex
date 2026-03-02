import getRouteEncounters from "@/server/routes/getRouteEncounters.ts";
import getRoutes from "@/server/routes/getRoutes.ts";
import getProgress from "@/server/saves/getProgress.ts";
import toggleCaught from "@/server/encounters/toggleCaught.ts";
import {
  Badge,
  Box,
  Burger,
  Group,
  Image,
  NavLink,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Route as SaveRoute } from "@/routes/saves/$saveId.tsx";
import { CheckCircle } from "@phosphor-icons/react";
import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────

type RouteEntry = Awaited<ReturnType<typeof getRoutes>>[number];
type EncounterEntry = Awaited<ReturnType<typeof getRouteEncounters>>[number];

// ── Method label helper ────────────────────────────────────────────

function methodLabel(method: string): string {
  const labels: Record<string, string> = {
    walk: "Grass",
    surf: "Surf",
    "old-rod": "Old Rod",
    "good-rod": "Good Rod",
    "super-rod": "Super Rod",
    "rock-smash": "Rock Smash",
    headbutt: "Headbutt",
    "gift-egg": "Gift",
    gift: "Gift",
    "only-one": "Fixed",
    pokeflute: "Pokéflute",
  };
  return labels[method] ?? method;
}

// ── Pokémon Card ──────────────────────────────────────────────────

function PokemonCard({
  entry,
  saveId,
}: {
  entry: EncounterEntry;
  saveId: number;
}) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      toggleCaught({ data: { saveId, speciesId: entry.species.id } }),
    onSuccess: (result: { caught: boolean }) => {
      // Instantly update the encounter cache without a full refetch
      qc.setQueriesData(
        { queryKey: ["routeEncounters"] },
        (old: EncounterEntry[] | undefined) => {
          if (!old) return old;
          return old.map((e: EncounterEntry) =>
            e.species.id === entry.species.id
              ? { ...e, caught: result.caught }
              : e
          );
        },
      );
      // Refresh route sidebar counts and global progress
      qc.invalidateQueries({ queryKey: ["routes"] });
      qc.invalidateQueries({ queryKey: ["progress"] });
    },
  });

  const caught = entry.caught;
  const sprite = entry.species.spriteUrl;
  const primaryMethod = entry.methods[0];

  const tooltipContent = entry.methods
    .map((m: EncounterEntry["methods"][number]) => {
      const lvl = m.minLevel != null
        ? m.minLevel === m.maxLevel
          ? `Lv ${m.minLevel}`
          : `Lv ${m.minLevel}–${m.maxLevel}`
        : null;
      const pct = m.chance != null ? `${m.chance}%` : null;
      return [methodLabel(m.method), lvl, pct].filter(Boolean).join(" ");
    })
    .join(" · ");

  return (
    <Tooltip label={tooltipContent} withArrow disabled={!tooltipContent}>
      <UnstyledButton onClick={() => !isPending && mutate()} w="100%">
        <Box
          p="xs"
          style={(theme) => ({
            borderRadius: theme.radius.md,
            border: `2px solid ${
              caught ? theme.colors.green[6] : theme.colors.gray[3]
            }`,
            background: caught ? theme.colors.green[0] : theme.colors.gray[0],
            opacity: caught ? 1 : 0.7,
            transition: "all 0.15s ease",
            position: "relative",
            cursor: isPending ? "wait" : "pointer",
            textAlign: "center",
          })}
        >
          {caught && (
            <Box
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                color: "var(--mantine-color-green-6)",
                lineHeight: 1,
              }}
            >
              <CheckCircle size={16} weight="fill" />
            </Box>
          )}
          {sprite
            ? (
              <Image
                src={sprite}
                alt={entry.species.name}
                w={64}
                h={64}
                mx="auto"
                style={{
                  imageRendering: "pixelated",
                  filter: caught ? "none" : "brightness(0)",
                  transition: "filter 0.15s ease",
                }}
              />
            )
            : <Box w={64} h={64} mx="auto" />}
          <Text size="xs" fw={caught ? 600 : 400} mt={2} truncate>
            {entry.species.name}
          </Text>
          {primaryMethod && (
            <Text size="xs" c="dimmed">
              {methodLabel(primaryMethod.method)}
              {primaryMethod.chance != null ? ` ${primaryMethod.chance}%` : ""}
            </Text>
          )}
        </Box>
      </UnstyledButton>
    </Tooltip>
  );
}

// ── Route List Item ───────────────────────────────────────────────

function RouteListItem({
  route,
  active,
  onClick,
}: {
  route: RouteEntry;
  active: boolean;
  onClick: () => void;
}) {
  const pct = route.totalSpecies > 0
    ? Math.round((route.caughtCount / route.totalSpecies) * 100)
    : 0;

  return (
    <NavLink
      active={active}
      onClick={onClick}
      label={
        <Stack gap={2}>
          <Text size="sm" fw={active ? 600 : 400} truncate>
            {route.name}
          </Text>
          <Group gap={6} align="center" wrap="nowrap">
            <Text size="xs" c="dimmed" style={{ whiteSpace: "nowrap" }}>
              {route.caughtCount}/{route.totalSpecies}
            </Text>
            <Progress
              value={pct}
              size="xs"
              flex={1}
              color={pct === 100 ? "green" : "blue"}
            />
          </Group>
        </Stack>
      }
    />
  );
}

// ── Save Page ─────────────────────────────────────────────────────

const SIDEBAR_WIDTH = 260;

export default function SavePage() {
  const { save, routes } = SaveRoute.useLoaderData();

  const theme = useMantineTheme();
  const isDesktop = useMediaQuery(
    `(min-width: ${theme.breakpoints.md})`,
    false,
  );

  const [
    sidebarOpened,
    { toggle: toggleSidebar },
  ] = useDisclosure(false);

  const [selectedRouteId, setSelectedRouteId] = useState<number | null>(
    routes[0]?.id ?? null,
  );

  // Live route list (refetches after caught toggle)
  const { data: liveRoutes = routes } = useQuery({
    queryKey: ["routes", save.id],
    queryFn: () =>
      getRoutes({ data: { gameId: save.gameId, saveId: save.id } }),
    initialData: routes,
    staleTime: 0,
  });

  // Encounters for the selected route
  const { data: encounters = [], isLoading: encLoading } = useQuery({
    queryKey: ["routeEncounters", selectedRouteId, save.id],
    queryFn: () =>
      getRouteEncounters({
        data: { routeId: selectedRouteId!, saveId: save.id },
      }),
    enabled: selectedRouteId !== null,
    staleTime: 0,
  });

  // Overall progress
  const { data: progress } = useQuery({
    queryKey: ["progress", save.id],
    queryFn: () => getProgress({ data: { saveId: save.id } }),
    staleTime: 0,
  });

  const selectedRoute = liveRoutes.find((r: RouteEntry) =>
    r.id === selectedRouteId
  );
  const progressPct = progress && progress.totalSpecies > 0
    ? Math.round((progress.caught / progress.totalSpecies) * 100)
    : 0;

  return (
    <Box
      style={{
        display: "flex",
        height: "calc(100dvh - 48px - 2 * var(--mantine-spacing-md))",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ── Sidebar: route list ─────────────────────────────────── */}
      <Box
        style={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          borderRight: isDesktop
            ? "1px solid var(--mantine-color-gray-3)"
            : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: isDesktop ? "relative" : "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 20,
          background: "var(--mantine-color-body)",
          transform: isDesktop
            ? "none"
            : sidebarOpened
            ? "translateX(0)"
            : "translateX(-100%)",
          transition: "transform 200ms ease",
          boxShadow: isDesktop ? "none" : "0 0 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* Save header */}
        <Box
          p="sm"
          style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
        >
          <Group justify="flex-end" align="center">
            {!isDesktop && (
              <Burger
                opened={sidebarOpened}
                onClick={toggleSidebar}
                size="sm"
                aria-label="Toggle route list"
              />
            )}
          </Group>
          <Text fw={700} size="sm" truncate>
            {save.name}
          </Text>
          <Badge
            size="xs"
            mt={2}
            color={save.game.slug === "fire-red" ? "red" : "green"}
          >
            {save.game.name}
          </Badge>
        </Box>

        {/* Route list */}
        <ScrollArea flex={1}>
          {liveRoutes.map((route: RouteEntry) => (
            <RouteListItem
              key={route.id}
              route={route}
              active={route.id === selectedRouteId}
              onClick={() => setSelectedRouteId(route.id)}
            />
          ))}
        </ScrollArea>
      </Box>

      {!isDesktop && sidebarOpened && (
        <Box
          onClick={toggleSidebar}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.4)",
            zIndex: 10,
          }}
        />
      )}

      {/* ── Main content: encounters ────────────────────────────── */}
      <ScrollArea flex={1} p="md">
        <Stack gap="md">
          {/* Burger to reopen sidebar when collapsed */}
          {!isDesktop && (
            <Group>
              <Burger
                opened={sidebarOpened}
                onClick={toggleSidebar}
                size="sm"
                aria-label="Toggle route list"
              />
            </Group>
          )}

          {/* Global progress */}
          {progress && (
            <Box
              p="md"
              style={(theme) => ({
                background: theme.colors.blue[0],
                borderRadius: theme.radius.md,
                border: `1px solid ${theme.colors.blue[3]}`,
              })}
            >
              <Group justify="space-between" mb={4}>
                <Text fw={600} size="sm">
                  Overall Progress
                </Text>
                <Text size="sm" c="dimmed">
                  {progress.caught}/{progress.totalSpecies} species caught
                </Text>
              </Group>
              <Progress value={progressPct} color="blue" />
            </Box>
          )}

          {/* Route header */}
          {selectedRoute && (
            <Group justify="space-between" align="center">
              <Title order={3}>{selectedRoute.name}</Title>
              <Text c="dimmed" size="sm">
                {selectedRoute.caughtCount}/{selectedRoute.totalSpecies} caught
              </Text>
            </Group>
          )}

          {/* Pokémon grid */}
          {encLoading && <Text c="dimmed">Loading encounters...</Text>}
          {!encLoading && encounters.length === 0 && (
            <Text c="dimmed">No encounters found for this route.</Text>
          )}
          {!encLoading && encounters.length > 0 && (
            <SimpleGrid cols={3}>
              {encounters.map((enc: EncounterEntry) => (
                <PokemonCard
                  key={enc.species.id}
                  entry={enc}
                  saveId={save.id}
                />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      </ScrollArea>
    </Box>
  );
}
