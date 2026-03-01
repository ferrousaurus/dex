import getGames from "@/server/games/getGames.ts";
import getSaves from "@/server/saves/getSaves.ts";
import createSave from "@/server/saves/createSave.ts";
import renameSave from "@/server/saves/renameSave.ts";
import deleteSave from "@/server/saves/deleteSave.ts";
import { Route as HomeRoute } from "@/routes/index.tsx";
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useState } from "react";

type Game = Awaited<ReturnType<typeof getGames>>[number];
type Save = Awaited<ReturnType<typeof getSaves>>[number];

// ── Create Save Modal ──────────────────────────────────────────────

function CreateSaveModal({
  opened,
  onClose,
  games,
}: {
  opened: boolean;
  onClose: () => void;
  games: Game[];
}) {
  const [name, setName] = useState("");
  const [gameId, setGameId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createSave({ data: { name: name.trim(), gameId: Number(gameId) } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saves"] });
      notifications.show({ message: "Save created!", color: "green" });
      setName("");
      setGameId(null);
      onClose();
    },
    onError: () => {
      notifications.show({ message: "Failed to create save", color: "red" });
    },
  });

  const canSubmit = name.trim().length > 0 && gameId !== null && !isPending;

  return (
    <Modal opened={opened} onClose={onClose} title="New Save">
      <Stack>
        <TextInput
          label="Save name"
          placeholder="My FireRed Run"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          data-autofocus
        />
        <Select
          label="Game"
          placeholder="Select a game"
          value={gameId}
          onChange={setGameId}
          data={games.map((g) => ({ value: String(g.id), label: g.name }))}
        />
        <Button
          onClick={() => mutate()}
          disabled={!canSubmit}
          loading={isPending}
        >
          Create
        </Button>
      </Stack>
    </Modal>
  );
}

// ── Rename Save Modal ──────────────────────────────────────────────

function RenameSaveModal({
  save,
  onClose,
}: {
  save: Save | null;
  onClose: () => void;
}) {
  const [name, setName] = useState(save?.name ?? "");
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      renameSave({ data: { id: save!.id, name: name.trim() } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saves"] });
      notifications.show({ message: "Save renamed!", color: "green" });
      onClose();
    },
    onError: () => {
      notifications.show({ message: "Failed to rename save", color: "red" });
    },
  });

  const canSubmit =
    name.trim().length > 0 && name.trim() !== save?.name && !isPending;

  return (
    <Modal opened={save !== null} onClose={onClose} title="Rename Save">
      <Stack>
        <TextInput
          label="New name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          data-autofocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && canSubmit) mutate();
          }}
        />
        <Button
          onClick={() => mutate()}
          disabled={!canSubmit}
          loading={isPending}
        >
          Rename
        </Button>
      </Stack>
    </Modal>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────

function DeleteSaveModal({
  save,
  onClose,
}: {
  save: Save | null;
  onClose: () => void;
}) {
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteSave({ data: { id: save!.id } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saves"] });
      notifications.show({ message: "Save deleted", color: "orange" });
      onClose();
    },
    onError: () => {
      notifications.show({ message: "Failed to delete save", color: "red" });
    },
  });

  return (
    <Modal opened={save !== null} onClose={onClose} title="Delete Save">
      <Stack>
        <Text>
          Are you sure you want to delete <strong>{save?.name}</strong>? This
          cannot be undone.
        </Text>
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button color="red" loading={isPending} onClick={() => mutate()}>
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

// ── Save Card ─────────────────────────────────────────────────────

function SaveCard({
  save,
  onRename,
  onDelete,
}: {
  save: Save;
  onRename: (s: Save) => void;
  onDelete: (s: Save) => void;
}) {
  const navigate = useNavigate();

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ cursor: "pointer" }}
      onClick={() => navigate({ to: "/saves/$saveId", params: { saveId: String(save.id) } })}
    >
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between" align="center">
          <Text fw={600} size="lg" truncate>
            {save.name}
          </Text>
          <Group gap={4} onClick={(e) => e.stopPropagation()}>
            <Tooltip label="Rename">
              <ActionIcon
                variant="subtle"
                size="sm"
                onClick={() => onRename(save)}
              >
                <PencilSimple size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete">
              <ActionIcon
                variant="subtle"
                size="sm"
                color="red"
                onClick={() => onDelete(save)}
              >
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Card.Section>
      <Group mt="md" align="center">
        <Badge color={save.game.slug === "fire-red" ? "red" : "green"}>
          {save.game.name}
        </Badge>
        <Text size="xs" c="dimmed">
          Created {new Date(save.createdAt).toLocaleDateString()}
        </Text>
      </Group>
    </Card>
  );
}

// ── Home Page ─────────────────────────────────────────────────────

export default function HomePage() {
  const { saves: initialSaves, games: initialGames } = HomeRoute.useLoaderData();
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [renameSaveTarget, setRenameSaveTarget] = useState<Save | null>(null);
  const [deleteSaveTarget, setDeleteSaveTarget] = useState<Save | null>(null);

  const { data: games = initialGames } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
    initialData: initialGames,
  });

  const { data: saves = initialSaves, isLoading } = useQuery({
    queryKey: ["saves"],
    queryFn: () => getSaves(),
    initialData: initialSaves,
  });

  return (
    <Stack gap="xl">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2}>Pokémon Route Tracker</Title>
          <Text c="dimmed" size="sm">
            Track which Pokémon you've caught across each route
          </Text>
        </div>
        <Button onClick={openCreate}>New Save</Button>
      </Group>

      {isLoading && <Text c="dimmed">Loading saves...</Text>}

      {!isLoading && saves.length === 0 && (
        <Card withBorder p="xl" ta="center">
          <Text c="dimmed">
            No saves yet. Create one to get started!
          </Text>
          <Button mt="md" onClick={openCreate}>
            Create Save
          </Button>
        </Card>
      )}

      {saves.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
          {saves.map((save) => (
            <SaveCard
              key={save.id}
              save={save}
              onRename={setRenameSaveTarget}
              onDelete={setDeleteSaveTarget}
            />
          ))}
        </SimpleGrid>
      )}

      <CreateSaveModal
        opened={createOpened}
        onClose={closeCreate}
        games={games}
      />
      <RenameSaveModal
        save={renameSaveTarget}
        onClose={() => setRenameSaveTarget(null)}
      />
      <DeleteSaveModal
        save={deleteSaveTarget}
        onClose={() => setDeleteSaveTarget(null)}
      />
    </Stack>
  );
}
