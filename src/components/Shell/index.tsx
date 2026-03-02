import auth from "@/clients/auth.ts";
import getSaves from "@/server/saves/getSaves.ts";
import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  Menu,
  NavLink,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";
import { useDisclosure } from "@mantine/hooks";
import getSave from "../../server/saves/getSave.ts";
import getRoutes from "../../server/routes/getRoutes.ts";
import { useParams } from "@tanstack/react-router";

export type ShellProps = PropsWithChildren;

type Save = Awaited<ReturnType<typeof getSaves>>[number];

export default function Shell({ children }: Readonly<ShellProps>) {
  const params = useParams({ strict: false });
  const { data: session } = auth.useSession();
  const [opened, { toggle }] = useDisclosure(false);

  const { data: saves = [] } = useQuery({
    queryKey: ["saves"],
    queryFn: () => getSaves(),
  });

  const savesByGameId = new Map<number, Save[]>();
  for (const save of saves) {
    savesByGameId.set(save.gameId, savesByGameId.get(save.gameId) ?? []);
  }

  return (
    <AppShell
      padding="md"
      header={{ height: 48 }}
      navbar={params.saveId !== undefined && session !== undefined
        ? { width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }
        : undefined}
    >
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Group align="center" gap="sm">
            {params.saveId !== undefined && (
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
              />
            )}
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

      {session !== undefined && (
        <AppShell.Navbar>
          <ScrollArea>
            <Navbar />
          </ScrollArea>
        </AppShell.Navbar>
      )}

      <AppShell.Main
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "calc(100dvh - 48px)",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}

function Navbar() {
  const params = useParams({
    strict: false,
  });

  if (params.saveId === undefined) {
    return null;
  }

  const saveId = Number(params.saveId);

  if (isNaN(saveId)) {
    return null;
  }

  return <SaveNavLinks saveId={saveId} />;
}

function SaveNavLinks({ saveId }: { saveId: Save["id"] }) {
  const { isPending, isError, data } = useQuery({
    queryKey: ["saves", saveId],
    queryFn: () => getSave({ data: { id: saveId } }),
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    return null;
  }

  return <SaveGameNavLinks save={data} />;
}

function SaveGameNavLinks({ save }: { save: Save }) {
  const { isPending, isError, data } = useQuery({
    queryKey: ["routes", { saveId: save.id, gameId: save.game.id }],
    queryFn: () =>
      getRoutes({
        data: {
          gameId: save.game.id,
          saveId: save.id,
        },
      }),
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <Stack>
      {data.map((route) => (
        <NavLink
          key={route.id}
          label={route.name}
          component={Link}
          to="/saves/$saveId/routes/$routeId"
          params={{
            saveId: save.id,
            routeId: route.id,
          }}
        />
      ))}
    </Stack>
  );
}
