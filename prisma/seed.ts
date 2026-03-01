// Seed script for Pokémon Route Tracker
// Uses canonical FRLG encounter data from prisma/data/kanto.ts
// The seed also supports live fetching from PokeAPI (see fetchFromPokeAPI flag).
import { PrismaClient } from "./generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { ROUTES, SPECIES, SPRITE_BASE } from "./data/kanto.ts";

const DATABASE_URL =
  Deno.env.get("DATABASE_URL") ??
  "postgresql://postgres:password@localhost:5432/dex";

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting seed...");

  // ── 1. Games ─────────────────────────────────────────────────────
  console.log("Creating games...");
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
  console.log(`  ✓ FireRed (id=${fireRed.id}), LeafGreen (id=${leafGreen.id})`);

  // ── 2. Species ───────────────────────────────────────────────────
  console.log(`Upserting ${SPECIES.length} species...`);
  for (const sp of SPECIES) {
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

  // ── 3. Routes and Encounters ──────────────────────────────────────
  const speciesIds = new Set(SPECIES.map((s) => s.id));
  let routeCount = 0;
  let encounterCount = 0;

  for (const routeData of ROUTES) {
    // Create FireRed route if it has encounters
    if (routeData.firered.length > 0) {
      const frRoute = await prisma.route.upsert({
        where: { slug_gameId: { slug: routeData.slug, gameId: fireRed.id } },
        update: { name: routeData.name },
        create: { name: routeData.name, slug: routeData.slug, gameId: fireRed.id },
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
          update: { minLevel: enc.minLevel, maxLevel: enc.maxLevel, chance: enc.chance },
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
        where: { slug_gameId: { slug: routeData.slug, gameId: leafGreen.id } },
        update: { name: routeData.name },
        create: { name: routeData.name, slug: routeData.slug, gameId: leafGreen.id },
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
          update: { minLevel: enc.minLevel, maxLevel: enc.maxLevel, chance: enc.chance },
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
  console.log(`   Species seeded: ${SPECIES.length}`);
  console.log(`   Encounters seeded: ${encounterCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    Deno.exit(1);
  })
  .finally(() => prisma.$disconnect());
