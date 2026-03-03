import toggleCaught from "@/server/encounters/toggleCaught.ts";
import getRouteEncounters from "@/server/routes/getRouteEncounters.ts";
import { Box, Image, Text, UnstyledButton } from "@mantine/core";
import { CheckCircle } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────────────────

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

export default function PokemonCard({
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

  function handleClick() {
    if (!isPending) {
      mutate();
    }
  }

  return (
    <UnstyledButton
      onClick={handleClick}
      w="100%"
    >
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
        <Text size="sm" c="black">
          {entry.species.name}
        </Text>
        {primaryMethod && (
          <>
            <Text size="xs" c="dimmed">
              {methodLabel(primaryMethod.method)}
            </Text>
            <Text size="xs" c="dimmed">
              {primaryMethod.chance != null ? ` ${primaryMethod.chance}%` : ""}
            </Text>
          </>
        )}
      </Box>
    </UnstyledButton>
  );
}
