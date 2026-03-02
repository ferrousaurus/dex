import auth from "@/clients/auth.ts";
import getGames from "@/server/games/getGames.ts";
import getSaves from "@/server/saves/getSaves.ts";
import {
  AppShell,
  Avatar,
  Button,
  Group,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export type ShellProps = PropsWithChildren;

type Game = Awaited<ReturnType<typeof getGames>>[number];
type Save = Awaited<ReturnType<typeof getSaves>>[number];

export default function Shell({ children }: Readonly<ShellProps>) {
  const { data: session } = auth.useSession();

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
    >
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Group align="center" gap="sm">
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
