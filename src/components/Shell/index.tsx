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
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export type ShellProps = PropsWithChildren;

type Save = Awaited<ReturnType<typeof getSaves>>[number];

export default function Shell({ children }: Readonly<ShellProps>) {
  const { data: session } = auth.useSession();
  const [opened, { toggle, close }] = useDisclosure();
  const { data: saves = [], isLoading: isLoadingSaves } = useQuery({
    queryKey: ["saves"],
    queryFn: () => getSaves(),
  });

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
        <AppShell.Section grow mt="sm">
          <ScrollArea type="hover">
            <Stack gap="xs">
              {isLoadingSaves && (
                <Text size="sm" c="dimmed">
                  Loading saves...
                </Text>
              )}
              {!isLoadingSaves && saves.length === 0 && (
                <Text size="sm" c="dimmed">
                  No saves yet.
                </Text>
              )}
              {saves.map((save) => (
                <NavLink
                  key={save.id}
                  label={save.name}
                  description={save.game?.name}
                  component={Link}
                  to="/saves/$saveId"
                  params={{ saveId: String(save.id) }}
                  onClick={close}
                />
              ))}
            </Stack>
          </ScrollArea>
        </AppShell.Section>
      </AppShell.Navbar>

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
