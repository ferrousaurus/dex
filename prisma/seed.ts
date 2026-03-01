// Seed script for Pokémon Route Tracker
// Fetches species and encounter data live from PokeAPI
import { PrismaClient } from "./generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

const DATABASE_URL = Deno.env.get("DATABASE_URL") ??
  "postgresql://postgres:password@localhost:5432/dex";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── PokeAPI constants ──────────────────────────────────────────────────
const POKEAPI = "https://pokeapi.co/api/v2";
const SPRITE_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";
const FRLG_VERSIONS = new Set(["firered", "leafgreen"]);
const VALID_METHODS = new Set([
  "walk",
  "surf",
  "old-rod",
  "good-rod",
  "super-rod",
]);
const MAX_SPECIES_ID = 150;
const CONCURRENCY = 10;
const MAX_RETRIES = 3;

// ── Types ──────────────────────────────────────────────────────────────
interface PokeAPISpecies {
  id: number;
  name: string;
  names: { name: string; language: { name: string; url: string } }[];
}

interface PokeAPIEncounterEntry {
  location_area: { name: string; url: string };
  version_details: {
    version: { name: string; url: string };
    max_chance: number;
    encounter_details: {
      min_level: number;
      max_level: number;
      chance: number;
      method: { name: string; url: string };
      condition_values: unknown[];
    }[];
  }[];
}

interface PokeAPILocationArea {
  id: number;
  name: string;
  names: { name: string; language: { name: string; url: string } }[];
  location: { name: string; url: string };
}

interface SpeciesRecord {
  id: number;
  name: string;
  slug: string;
}

interface EncounterRecord {
  speciesId: number;
  method: string;
  minLevel: number;
  maxLevel: number;
  chance: number;
}

interface RouteRecord {
  name: string;
  slug: string;
  firered: EncounterRecord[];
  leafgreen: EncounterRecord[];
}

// ── Fetch helpers ──────────────────────────────────────────────────────

async function fetchJSON<T>(url: string): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return (await res.json()) as T;
    } catch (err) {
      if (attempt === MAX_RETRIES) throw err;
      const delay = 1000 * 2 ** attempt;
      console.warn(
        `  ⚠ Retry ${
          attempt + 1
        }/${MAX_RETRIES} for ${url} (waiting ${delay}ms)`,
      );
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
}

async function fetchBatch<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency = CONCURRENCY,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

/** Convert a location-area slug to a human-readable name (fallback). */
function slugToDisplayName(slug: string): string {
  return slug
    .replace(/-area$/, "")
    .split("-")
    .map((part) => {
      if (/^\d+f$/i.test(part) || /^b\d+f$/i.test(part)) {
        return part.toUpperCase();
      }
      if (part === "mt") return "Mt.";
      if (part === "pokemon") return "Pokémon";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join(" ");
}

// ── Data fetching ──────────────────────────────────────────────────────

async function fetchAllSpecies(): Promise<SpeciesRecord[]> {
  console.log(`Fetching ${MAX_SPECIES_ID} species from PokeAPI...`);
  const ids = Array.from({ length: MAX_SPECIES_ID }, (_, i) => i + 1);

  const species = await fetchBatch(ids, async (id) => {
    const data = await fetchJSON<PokeAPISpecies>(
      `${POKEAPI}/pokemon-species/${id}`,
    );
    const englishName = data.names.find((n) =>
      n.language.name === "en"
    )?.name ?? data.name;
    return { id: data.id, name: englishName, slug: data.name };
  });

  console.log(`  ✓ Fetched ${species.length} species`);
  return species;
}

async function fetchAllEncounters(): Promise<
  Map<
    string,
    { firered: EncounterRecord[]; leafgreen: EncounterRecord[] }
  >
> {
  console.log(
    `Fetching encounters for ${MAX_SPECIES_ID} pokémon from PokeAPI...`,
  );
  const ids = Array.from({ length: MAX_SPECIES_ID }, (_, i) => i + 1);

  // slug -> { firered: [...], leafgreen: [...] }
  const routeMap = new Map<
    string,
    { firered: EncounterRecord[]; leafgreen: EncounterRecord[] }
  >();

  await fetchBatch(ids, async (id) => {
    const entries = await fetchJSON<PokeAPIEncounterEntry[]>(
      `${POKEAPI}/pokemon/${id}/encounters`,
    );

    for (const entry of entries) {
      const areaSlug = entry.location_area.name;

      for (const vd of entry.version_details) {
        const version = vd.version.name;
        if (!FRLG_VERSIONS.has(version)) continue;

        // Group encounter details by method, then aggregate
        const byMethod = new Map<
          string,
          { minLevel: number; maxLevel: number; chance: number }
        >();

        for (const ed of vd.encounter_details) {
          const method = ed.method.name;
          if (!VALID_METHODS.has(method)) continue;

          const existing = byMethod.get(method);
          if (existing) {
            existing.minLevel = Math.min(existing.minLevel, ed.min_level);
            existing.maxLevel = Math.max(existing.maxLevel, ed.max_level);
            existing.chance += ed.chance;
          } else {
            byMethod.set(method, {
              minLevel: ed.min_level,
              maxLevel: ed.max_level,
              chance: ed.chance,
            });
          }
        }

        if (byMethod.size === 0) continue;

        if (!routeMap.has(areaSlug)) {
          routeMap.set(areaSlug, { firered: [], leafgreen: [] });
        }
        const route = routeMap.get(areaSlug)!;
        const encounterList = version === "firered"
          ? route.firered
          : route.leafgreen;

        for (const [method, agg] of byMethod) {
          encounterList.push({
            speciesId: id,
            method,
            minLevel: agg.minLevel,
            maxLevel: agg.maxLevel,
            chance: agg.chance,
          });
        }
      }
    }
  });

  console.log(`  ✓ Discovered ${routeMap.size} location areas`);
  return routeMap;
}

async function resolveAreaNames(
  slugs: string[],
): Promise<Map<string, string>> {
  console.log(`Resolving display names for ${slugs.length} location areas...`);
  const nameMap = new Map<string, string>();

  await fetchBatch(slugs, async (slug) => {
    try {
      const data = await fetchJSON<PokeAPILocationArea>(
        `${POKEAPI}/location-area/${slug}`,
      );
      const englishName = data.names.find(
        (n) => n.language.name === "en",
      )?.name;
      nameMap.set(slug, englishName ?? slugToDisplayName(slug));
    } catch {
      nameMap.set(slug, slugToDisplayName(slug));
    }
  });

  console.log(`  ✓ Resolved area names`);
  return nameMap;
}

// ── Main seed ──────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting seed (fetching from PokeAPI)...\n");

  // Fetch species and encounters in parallel
  const [species, encounterMap] = await Promise.all([
    fetchAllSpecies(),
    fetchAllEncounters(),
  ]);

  // Resolve location area display names
  const areaNames = await resolveAreaNames([...encounterMap.keys()]);

  // Build route records
  const routes: RouteRecord[] = [];
  for (const [slug, encounters] of encounterMap) {
    routes.push({
      name: areaNames.get(slug) ?? slugToDisplayName(slug),
      slug,
      firered: encounters.firered,
      leafgreen: encounters.leafgreen,
    });
  }

  // ── 1. Games ─────────────────────────────────────────────────────
  console.log("\nCreating games...");
  const [fireRed, leafGreen] = await Promise.all([
    prisma.game.upsert({
      where: { slug: "fire-red" },
      update: {},
      create: { name: "FireRed", slug: "fire-red" },
    }),
    prisma.game.upsert({
      where: { slug: "leaf-green" },
      update: {},
      create: { name: "LeafGreen", slug: "leaf-green" },
    }),
  ]);
  console.log(
    `  ✓ FireRed (id=${fireRed.id}), LeafGreen (id=${leafGreen.id})`,
  );

  // ── 2. Species ───────────────────────────────────────────────────
  console.log(`Upserting ${species.length} species...`);
  for (const sp of species) {
    await prisma.species.upsert({
      where: { id: sp.id },
      update: { name: sp.name, spriteUrl: `${SPRITE_BASE}/${sp.id}.png` },
      create: {
        id: sp.id,
        name: sp.name,
        slug: sp.slug,
        spriteUrl: `${SPRITE_BASE}/${sp.id}.png`,
      },
    });
  }
  console.log("  ✓ Species done");

  // ── 3. Routes and Encounters ─────────────────────────────────────
  const speciesIds = new Set(species.map((s) => s.id));
  let routeCount = 0;
  let encounterCount = 0;

  for (const routeData of routes) {
    // Create FireRed route if it has encounters
    if (routeData.firered.length > 0) {
      const frRoute = await prisma.route.upsert({
        where: { slug_gameId: { slug: routeData.slug, gameId: fireRed.id } },
        update: { name: routeData.name },
        create: {
          name: routeData.name,
          slug: routeData.slug,
          gameId: fireRed.id,
        },
      });
      routeCount++;

      for (const enc of routeData.firered) {
        if (!speciesIds.has(enc.speciesId)) continue;
        await prisma.encounter.upsert({
          where: {
            routeId_speciesId_method: {
              routeId: frRoute.id,
              speciesId: enc.speciesId,
              method: enc.method,
            },
          },
          update: {
            minLevel: enc.minLevel,
            maxLevel: enc.maxLevel,
            chance: enc.chance,
          },
          create: {
            routeId: frRoute.id,
            speciesId: enc.speciesId,
            method: enc.method,
            minLevel: enc.minLevel,
            maxLevel: enc.maxLevel,
            chance: enc.chance,
          },
        });
        encounterCount++;
      }
    }

    // Create LeafGreen route if it has encounters
    if (routeData.leafgreen.length > 0) {
      const lgRoute = await prisma.route.upsert({
        where: {
          slug_gameId: { slug: routeData.slug, gameId: leafGreen.id },
        },
        update: { name: routeData.name },
        create: {
          name: routeData.name,
          slug: routeData.slug,
          gameId: leafGreen.id,
        },
      });
      routeCount++;

      for (const enc of routeData.leafgreen) {
        if (!speciesIds.has(enc.speciesId)) continue;
        await prisma.encounter.upsert({
          where: {
            routeId_speciesId_method: {
              routeId: lgRoute.id,
              speciesId: enc.speciesId,
              method: enc.method,
            },
          },
          update: {
            minLevel: enc.minLevel,
            maxLevel: enc.maxLevel,
            chance: enc.chance,
          },
          create: {
            routeId: lgRoute.id,
            speciesId: enc.speciesId,
            method: enc.method,
            minLevel: enc.minLevel,
            maxLevel: enc.maxLevel,
            chance: enc.chance,
          },
        });
        encounterCount++;
      }
    }
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   Routes seeded: ${routeCount}`);
  console.log(`   Species seeded: ${species.length}`);
  console.log(`   Encounters seeded: ${encounterCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    Deno.exit(1);
  })
  .finally(() => prisma.$disconnect());
