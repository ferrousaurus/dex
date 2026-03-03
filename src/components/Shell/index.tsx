import auth from "@/clients/auth.ts";
import Anchor from "@/components/Links/Anchor.tsx";
import getSaves from "@/server/saves/getSaves.ts";
import {
  AppShell,
  Avatar,
  Breadcrumbs,
  Group,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { useParams } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export type ShellProps = PropsWithChildren;

export default function Shell({ children }: Readonly<ShellProps>) {
  const { data: session } = auth.useSession();

  return (
    <AppShell
      padding="md"
      header={{ height: 48 }}
    >
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Group align="center" gap="sm">
            <ShellBreadcrumbs />
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

function RoutesBreadcrumb({ saveId }: { saveId: string }) {
  return (
    <Anchor
      to="/saves/$saveId/routes"
      params={{ saveId }}
    >
      Routes
    </Anchor>
  );
}

function ShellBreadcrumbs() {
  const params = useParams({ strict: false });

  return (
    <Breadcrumbs>
      <Anchor to="/" size="sm">
        DexNav
      </Anchor>
      {params.saveId && <RoutesBreadcrumb saveId={params.saveId} />}
    </Breadcrumbs>
  );
}
