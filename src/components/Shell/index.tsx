import auth from "@/clients/auth.ts";
import getGames from "@/server/games/getGames.ts";
import createSave from "@/server/saves/createSave.ts";
import getSaves from "@/server/saves/getSaves.ts";
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  Modal,
  NavLink,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useMatchRoute } from "@tanstack/react-router";
import { PropsWithChildren, useState } from "react";
import { PencilIcon } from "@phosphor-icons/react";

export type ShellProps = PropsWithChildren;

type Game = Awaited<ReturnType<typeof getGames>>[number];
type Save = Awaited<ReturnType<typeof getSaves>>[number];

export default function Shell({ children }: Readonly<ShellProps>) {
  const { data: session } = auth.useSession();
  const [opened, { toggle, close }] = useDisclosure();
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [createName, setCreateName] = useState("");
  const [createGameId, setCreateGameId] = useState<number | null>(null);

  const qc = useQueryClient();

  const { data: games = [], isLoading: isLoadingGames } = useQuery({
    queryKey: ["games"],
    queryFn: () => getGames(),
  });

  const { data: saves = [], isLoading: isLoadingSaves } = useQuery({
    queryKey: ["saves"],
    queryFn: () => getSaves(),
  });

  const matchRoute = useMatchRoute();
  const saveMatch = matchRoute({ to: "/saves/$saveId", fuzzy: true });
  const currentSaveId = saveMatch?.params?.saveId
    ? Number(saveMatch.params.saveId)
    : null;
  const currentSaveGameId = currentSaveId
    ? saves.find((save) => save.id === currentSaveId)?.gameId ?? null
    : null;

  const { mutate: createSaveMutation, isPending: isCreating } = useMutation({
    mutationFn: () =>
      createSave({
        data: { name: createName.trim(), gameId: createGameId! },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["saves"] });
      notifications.show({ message: "Save created!", color: "green" });
      setCreateName("");
      closeCreate();
    },
    onError: () => {
      notifications.show({ message: "Failed to create save", color: "red" });
    },
  });

  const createGame: Game | undefined = games.find(
    (game) => game.id === createGameId,
  );
  const canCreate = createGameId !== null && createName.trim().length > 0 &&
    !isCreating;

  const savesByGameId = new Map<number, Save[]>();
  for (const save of saves) {
    const list = savesByGameId.get(save.gameId) ?? [];
    list.push(save);
    savesByGameId.set(save.gameId, list);
  }

  return (
    <AppShell
      padding="md"
      header={{ height: 48 }}
      navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }}
    >
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Group align="center" gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Button variant="transparent" component={Link} to="/" size="sm">
              DexNav
            </Button>
          </Group>
          <Group>
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Avatar src={session?.user.image} size="sm" />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                {session === null
                  ? (
                    <Menu.Item
                      onClick={() => {
                        auth.signIn.social({ provider: "discord" });
                      }}
                    >
                      Log In with Discord
                    </Menu.Item>
                  )
                  : (
                    <>
                      <Menu.Label>{session.user.name}</Menu.Label>
                      <Menu.Item
                        onClick={() => {
                          auth.signOut();
                        }}
                      >
                        Log Out
                      </Menu.Item>
                    </>
                  )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed">
            Your Saves
          </Text>
        </AppShell.Section>
        <AppShell.Section grow mt="sm">
          <ScrollArea type="hover">
            <Stack gap="xs">
              {isLoadingGames && (
                <Text size="sm" c="dimmed">
                  Loading games...
                </Text>
              )}
              {!isLoadingGames && games.length === 0 && (
                <Text size="sm" c="dimmed">
                  No games available.
                </Text>
              )}
              {isLoadingSaves && (
                <Text size="sm" c="dimmed">
                  Loading saves...
                </Text>
              )}
              {games.map((game) => {
                const gameSaves = savesByGameId.get(game.id) ?? [];
                return (
                  <NavLink
                    key={game.id}
                    label={game.name}
                    childrenOffset="md"
                    defaultOpened={game.id === currentSaveGameId}
                  >
                    {gameSaves.map((save) => (
                      <NavLink
                        key={save.id}
                        label={save.name}
                        component={Link}
                        to="/saves/$saveId"
                        params={{ saveId: String(save.id) }}
                        onClick={close}
                      />
                    ))}
                    <NavLink
                      label="New"
                      rightSection={<PencilIcon size={12} />}
                      mt="xs"
                      onClick={() => {
                        setCreateGameId(game.id);
                        setCreateName("");
                        openCreate();
                      }}
                    />
                  </NavLink>
                );
              })}
            </Stack>
          </ScrollArea>
        </AppShell.Section>
      </AppShell.Navbar>

      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title={`New ${createGame?.name ?? "Save"}`}
      >
        <Stack>
          <TextInput
            label="Save name"
            placeholder={`My ${createGame?.name ?? "Game"} Run`}
            value={createName}
            onChange={(e) => setCreateName(e.currentTarget.value)}
            data-autofocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && canCreate) createSaveMutation();
            }}
          />
          <Button
            onClick={() => createSaveMutation()}
            disabled={!canCreate}
            loading={isCreating}
          >
            Create
          </Button>
        </Stack>
      </Modal>

      <AppShell.Main
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100vh - 48px)",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
