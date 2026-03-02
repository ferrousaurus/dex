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
  NavLinkProps,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PropsWithChildren, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import getSave from "../../server/saves/getSave.ts";
import getRoutes from "../../server/routes/getRoutes.ts";
import { BASE_NAME_FALLBACK_LABELS, groupRoutes } from "@/lib/groupRoutes.ts";
import { useParams } from "@tanstack/react-router";

export type ShellProps = PropsWithChildren;

type Save = Awaited<ReturnType<typeof getSaves>>[number];

export default function Shell({ children }: Readonly<ShellProps>) {
  const params = useParams({ strict: false });
  const { data: session } = auth.useSession();
  const [opened, { close, toggle }] = useDisclosure(false);

  return (
    <AppShell
      padding="md"
      header={{ height: 48 }}
      navbar={params.saveId !== undefined && session !== undefined
        ? {
          width: 260,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }
        : undefined}
    >
      <AppShell.Header px="md">
        <Group justify="space-between" align="center" h="100%">
          <Group align="center" gap="sm">
            {params.saveId !== undefined && (
              <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
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
            <Navbar onClick={close} />
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

function Navbar({ onClick }: { onClick: NavLinkProps["onClick"] }) {
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

  return <SaveNavLinks saveId={saveId} onClick={onClick} />;
}

function SaveNavLinks(
  { saveId, onClick }: { saveId: Save["id"]; onClick: NavLinkProps["onClick"] },
) {
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

  return <SaveGameNavLinks save={data} onClick={onClick} />;
}

function SaveGameNavLinks(
  { save, onClick }: { save: Save; onClick: NavLinkProps["onClick"] },
) {
  const { isPending, isError, data } = useQuery({
    queryKey: ["routes", { saveId: save.id, gameId: save.game.id }],
    queryFn: () =>
      getRoutes({
        data: {
          gameId: save.game.id,
          saveId: save.id,
        },
      }),
    select: groupRoutes,
  });

  if (isPending) {
    return null;
  }

  if (isError) {
    return null;
  }

  return (
    <Stack gap={0}>
      {data.map((item) =>
        item.kind === "single"
          ? (
            <NavLink
              key={item.route.id}
              label={item.route.name}
              component={Link}
              to="/saves/$saveId/routes/$routeId"
              onClick={onClick}
              params={{
                saveId: save.id,
                routeId: item.route.id,
              }}
            />
          )
          : (
            <NavLink
              key={item.baseName}
              label={item.baseName}
              childrenOffset={16}
            >
              {item.routes.map((route) => {
                const suffix = route.name === item.baseName
                  ? (BASE_NAME_FALLBACK_LABELS[item.baseName] ?? item.baseName)
                  : route.name.replace(item.baseName, "").trim()
                    .replace(/^\(/, "").replace(/\)$/, "");
                return (
                  <NavLink
                    key={route.id}
                    label={suffix}
                    component={Link}
                    to="/saves/$saveId/routes/$routeId"
                    onClick={onClick}
                    params={{
                      saveId: save.id,
                      routeId: route.id,
                    }}
                  />
                );
              })}
            </NavLink>
          )
      )}
    </Stack>
  );
}
