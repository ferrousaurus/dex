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
// ── Game configuration ────────────────────────────────────────────────
interface GameConfig {
  name: string;
  dbSlug: string;
  apiSlug: string;
  maxSpeciesId: number;
}

const GAMES: GameConfig[] = [
  // Gen 1
  { name: "Red", dbSlug: "red", apiSlug: "red", maxSpeciesId: 151 },
  { name: "Blue", dbSlug: "blue", apiSlug: "blue", maxSpeciesId: 151 },
  { name: "Yellow", dbSlug: "yellow", apiSlug: "yellow", maxSpeciesId: 151 },
  // Gen 2
  { name: "Gold", dbSlug: "gold", apiSlug: "gold", maxSpeciesId: 251 },
  { name: "Silver", dbSlug: "silver", apiSlug: "silver", maxSpeciesId: 251 },
  { name: "Crystal", dbSlug: "crystal", apiSlug: "crystal", maxSpeciesId: 251 },
  // Gen 3
  { name: "Ruby", dbSlug: "ruby", apiSlug: "ruby", maxSpeciesId: 386 },
  {
    name: "Sapphire",
    dbSlug: "sapphire",
    apiSlug: "sapphire",
    maxSpeciesId: 386,
  },
  { name: "Emerald", dbSlug: "emerald", apiSlug: "emerald", maxSpeciesId: 386 },
  {
    name: "FireRed",
    dbSlug: "fire-red",
    apiSlug: "firered",
    maxSpeciesId: 386,
  },
  {
    name: "LeafGreen",
    dbSlug: "leaf-green",
    apiSlug: "leafgreen",
    maxSpeciesId: 386,
  },
  // Gen 4
  { name: "Diamond", dbSlug: "diamond", apiSlug: "diamond", maxSpeciesId: 493 },
  { name: "Pearl", dbSlug: "pearl", apiSlug: "pearl", maxSpeciesId: 493 },
  {
    name: "Platinum",
    dbSlug: "platinum",
    apiSlug: "platinum",
    maxSpeciesId: 493,
  },
  {
    name: "HeartGold",
    dbSlug: "heart-gold",
    apiSlug: "heartgold",
    maxSpeciesId: 493,
  },
  {
    name: "SoulSilver",
    dbSlug: "soul-silver",
    apiSlug: "soulsilver",
    maxSpeciesId: 493,
  },
  // Gen 5
  { name: "Black", dbSlug: "black", apiSlug: "black", maxSpeciesId: 649 },
  { name: "White", dbSlug: "white", apiSlug: "white", maxSpeciesId: 649 },
  {
    name: "Black 2",
    dbSlug: "black-2",
    apiSlug: "black-2",
    maxSpeciesId: 649,
  },
  {
    name: "White 2",
    dbSlug: "white-2",
    apiSlug: "white-2",
    maxSpeciesId: 649,
  },
  // Gen 6
  { name: "X", dbSlug: "x", apiSlug: "x", maxSpeciesId: 721 },
  { name: "Y", dbSlug: "y", apiSlug: "y", maxSpeciesId: 721 },
  {
    name: "Omega Ruby",
    dbSlug: "omega-ruby",
    apiSlug: "omega-ruby",
    maxSpeciesId: 721,
  },
  {
    name: "Alpha Sapphire",
    dbSlug: "alpha-sapphire",
    apiSlug: "alpha-sapphire",
    maxSpeciesId: 721,
  },
  // Gen 7
  { name: "Sun", dbSlug: "sun", apiSlug: "sun", maxSpeciesId: 809 },
  { name: "Moon", dbSlug: "moon", apiSlug: "moon", maxSpeciesId: 809 },
  {
    name: "Ultra Sun",
    dbSlug: "ultra-sun",
    apiSlug: "ultra-sun",
    maxSpeciesId: 809,
  },
  {
    name: "Ultra Moon",
    dbSlug: "ultra-moon",
    apiSlug: "ultra-moon",
    maxSpeciesId: 809,
  },
  // Gen 8
  { name: "Sword", dbSlug: "sword", apiSlug: "sword", maxSpeciesId: 898 },
  { name: "Shield", dbSlug: "shield", apiSlug: "shield", maxSpeciesId: 898 },
  // Gen 9
  {
    name: "Scarlet",
    dbSlug: "scarlet",
    apiSlug: "scarlet",
    maxSpeciesId: 1025,
  },
  { name: "Violet", dbSlug: "violet", apiSlug: "violet", maxSpeciesId: 1025 },
];

const ALL_API_SLUGS = new Set(GAMES.map((g) => g.apiSlug));
const MAX_SPECIES_ID = Math.max(...GAMES.map((g) => g.maxSpeciesId));
const VALID_METHODS = new Set([
  "walk",
  "surf",
  "old-rod",
  "good-rod",
  "super-rod",
  "rock-smash",
  "headbutt",
]);
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
  encounters: Map<string, EncounterRecord[]>;
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
  Map<string, Map<string, EncounterRecord[]>>
> {
  console.log(
    `Fetching encounters for ${MAX_SPECIES_ID} pokémon from PokeAPI...`,
  );
  const ids = Array.from({ length: MAX_SPECIES_ID }, (_, i) => i + 1);

  // areaSlug -> (apiVersionSlug -> EncounterRecord[])
  const routeMap = new Map<string, Map<string, EncounterRecord[]>>();

  await fetchBatch(ids, async (id) => {
    const entries = await fetchJSON<PokeAPIEncounterEntry[]>(
      `${POKEAPI}/pokemon/${id}/encounters`,
    );

    for (const entry of entries) {
      const areaSlug = entry.location_area.name;

      for (const vd of entry.version_details) {
        const version = vd.version.name;
        if (!ALL_API_SLUGS.has(version)) continue;

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
          routeMap.set(areaSlug, new Map());
        }
        const areaVersions = routeMap.get(areaSlug)!;
        if (!areaVersions.has(version)) {
          areaVersions.set(version, []);
        }
        const encounterList = areaVersions.get(version)!;

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
  for (const [slug, versionEncounters] of encounterMap) {
    routes.push({
      name: areaNames.get(slug) ?? slugToDisplayName(slug),
      slug,
      encounters: versionEncounters,
    });
  }

  // ── 1. Games ─────────────────────────────────────────────────────
  console.log("\nCreating games...");
  const gameRecords = new Map<
    string,
    { id: number; maxSpeciesId: number }
  >();
  for (const cfg of GAMES) {
    const game = await prisma.game.upsert({
      where: { slug: cfg.dbSlug },
      update: {},
      create: { name: cfg.name, slug: cfg.dbSlug },
    });
    gameRecords.set(cfg.apiSlug, {
      id: game.id,
      maxSpeciesId: cfg.maxSpeciesId,
    });
    console.log(`  ✓ ${cfg.name} (id=${game.id})`);
  }

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
    for (const [apiSlug, gameInfo] of gameRecords) {
      const versionEncounters = routeData.encounters.get(apiSlug) ?? [];
      if (versionEncounters.length === 0) continue;

      // Filter encounters to species within this game's generation
      const filteredEncounters = versionEncounters.filter(
        (enc) =>
          enc.speciesId <= gameInfo.maxSpeciesId &&
          speciesIds.has(enc.speciesId),
      );
      if (filteredEncounters.length === 0) continue;

      const route = await prisma.route.upsert({
        where: {
          slug_gameId: { slug: routeData.slug, gameId: gameInfo.id },
        },
        update: { name: routeData.name },
        create: {
          name: routeData.name,
          slug: routeData.slug,
          gameId: gameInfo.id,
        },
      });
      routeCount++;

      for (const enc of filteredEncounters) {
        await prisma.encounter.upsert({
          where: {
            routeId_speciesId_method: {
              routeId: route.id,
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
            routeId: route.id,
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
