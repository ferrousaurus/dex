import auth from "@/clients/auth.ts";
import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PropsWithChildren } from "react";

export type ShellProps = PropsWithChildren;

export default function Shell({ children }: Readonly<ShellProps>) {
  const { data: session } = auth.useSession();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell padding="md" header={{ height: 48 }}>
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Group align="center" gap="sm">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700} size="sm">
              DexNav
            </Text>
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
          minHeight: "calc(100vh - 48px)",
        }}
      >
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
