import auth from "@/clients/auth.ts";
import { BASE_NAME_FALLBACK_LABELS, groupRoutes } from "@/lib/groupRoutes.ts";
import getSaves from "@/server/saves/getSaves.ts";
import {
  Anchor,
  AppShell,
  Avatar,
  Breadcrumbs,
  Burger,
  Group,
  Menu,
  NavLink,
  NavLinkProps,
  Progress,
  ScrollArea,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { PropsWithChildren } from "react";
import getRoutes from "../../server/routes/getRoutes.ts";
import getSave from "../../server/saves/getSave.ts";
import { useLocation } from "@tanstack/react-router";
import getRoute from "../../server/routes/getRoute.ts";

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

function SaveBreadcrumb({ saveId }: { saveId: string }) {
  const { data } = useQuery({
    queryKey: ["saves", { saveId: Number(saveId) }],
    queryFn: () => getSave({ data: { id: Number(saveId) } }),
  });

  return (
    <>
      <Anchor
        component={Link}
        to="/saves/$saveId"
        params={{ saveId } as never}
        visibleFrom="md"
      >
        {data?.name ?? "Save"}
      </Anchor>
      <Anchor
        component={Link}
        to="/saves/$saveId"
        params={{ saveId } as never}
        hiddenFrom="md"
      >
        Save
      </Anchor>
    </>
  );
}

function RoutesBreadcrumb({ saveId }: { saveId: string }) {
  return (
    <Anchor
      component={Link}
      to="/saves/$saveId/routes"
      params={{ saveId } as never}
    >
      Routes
    </Anchor>
  );
}

function RouteBreadcrumb(
  { saveId, routeId }: { saveId: string; routeId: string },
) {
  const { isSuccess, data } = useQuery({
    queryKey: ["routes", { saveId: Number(saveId), routeId: Number(routeId) }],
    queryFn: () => getRoute({ data: { routeId, saveId } }),
  });

  return (
    <>
      <Anchor
        component={Link}
        to="/saves/$saveId/routes/$routeId"
        params={{ saveId, routeId } as never}
        hiddenFrom="md"
      >
        Route
      </Anchor>
      <Anchor
        component={Link}
        to="/saves/$saveId/routes/$routeId"
        params={{ saveId, routeId } as never}
        visibleFrom="md"
      >
        {!isSuccess ? `Route ${routeId}` : data.name}
      </Anchor>
    </>
  );
}

function ShellBreadcrumbs() {
  const params = useParams({ strict: false });
  const location = useLocation();

  return (
    <Breadcrumbs>
      <Anchor component={Link} to="/" size="sm">
        DexNav
      </Anchor>
      {params.saveId && <SaveBreadcrumb saveId={params.saveId} />}
      {params.saveId && location.pathname.includes("/routes") && (
        <RoutesBreadcrumb saveId={params.saveId} />
      )}
      {params.saveId && params.routeId && (
        <RouteBreadcrumb
          saveId={params.saveId}
          routeId={params.routeId}
        />
      )}
    </Breadcrumbs>
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
    queryKey: ["saves", { saveId }],
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
              description={
                <Progress
                  size="xs"
                  value={item.route.totalSpecies === 0
                    ? 0
                    : item.route.caughtCount / item.route.totalSpecies * 100}
                  aria-label={`${item.route.caughtCount} of ${item.route.totalSpecies} species caught`}
                />
              }
              component={Link}
              to="/saves/$saveId/routes/$routeId"
              onClick={onClick}
              params={{
                saveId: save.id,
                routeId: item.route.id,
              } as never}
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
                    description={
                      <Progress
                        size="xs"
                        value={route.totalSpecies === 0
                          ? 0
                          : route.caughtCount / route.totalSpecies * 100}
                        aria-label={`${route.caughtCount} of ${route.totalSpecies} species caught`}
                      />
                    }
                    component={Link}
                    to="/saves/$saveId/routes/$routeId"
                    onClick={onClick}
                    params={{
                      saveId: save.id,
                      routeId: route.id,
                    } as never}
                  />
                );
              })}
            </NavLink>
          )
      )}
    </Stack>
  );
}
