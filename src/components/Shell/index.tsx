import auth from "@/clients/auth.ts";
import {
  Anchor,
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  NavLink,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export type ShellProps = PropsWithChildren;

export default function Shell({ children }: Readonly<ShellProps>) {
  const { data: session } = auth.useSession();
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      header={{ height: 48 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group justify="space-between" align="center" h="100%">
          <Group align="center">
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="md"
            />
          </Group>
          <Group>
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Avatar src={session?.user.image} />
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
                      Log In
                    </Menu.Item>
                  )
                  : (
                    <Menu.Item
                      onClick={() => {
                        auth.signOut();
                      }}
                    >
                      Log Out
                    </Menu.Item>
                  )}
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavLink
          component={Link}
          to="/"
          leftSection={<HouseIcon />}
          label="Home"
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {session !== null ? children : (
          <Text>
            Please{" "}
            <Anchor
              onClick={() =>
                auth.signIn.social({
                  provider: "discord",
                })}
            >
              log in
            </Anchor>{" "}
            to access this content.
          </Text>
        )}
      </AppShell.Main>
    </AppShell>
  );
}
