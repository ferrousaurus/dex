// When a route's name matches the group base name exactly (no suffix),
// use this label instead of the base name for known cases.
export const BASE_NAME_FALLBACK_LABELS: Record<string, string> = {
  Trade: "Regional",
};

// Strip known sub-area suffixes to extract a base name for grouping
function getBaseName(name: string): string {
  return name
    .replace(/\s+B?\d+F$/, "") // Floor: " 1F", " B1F", " B2F"
    .replace(/\s+\(.*\)$/, "") // Parenthetical: " (Water)"
    .replace(/\s+(East|North|South|West|Center)$/, ""); // Direction
}

export type GroupedItem<T extends { name: string }> =
  | { kind: "single"; route: T }
  | { kind: "group"; baseName: string; routes: T[] };

export function groupRoutes<T extends { name: string }>(
  routes: T[],
): GroupedItem<T>[] {
  const baseNameCounts = new Map<string, number>();
  for (const route of routes) {
    const base = getBaseName(route.name);
    baseNameCounts.set(base, (baseNameCounts.get(base) ?? 0) + 1);
  }

  const items: GroupedItem<T>[] = [];
  const pendingGroups = new Map<string, T[]>();

  for (const route of routes) {
    const base = getBaseName(route.name);
    if (baseNameCounts.get(base)! >= 2) {
      if (!pendingGroups.has(base)) {
        pendingGroups.set(base, []);
        items.push({
          kind: "group",
          baseName: base,
          routes: pendingGroups.get(base)!,
        });
      }
      pendingGroups.get(base)!.push(route);
    } else {
      items.push({ kind: "single", route });
    }
  }

  return items;
}
