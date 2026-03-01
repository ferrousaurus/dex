import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const getRouteEncounters = createServerFn({ method: "GET" })
  .validator(z.object({ routeId: z.number(), saveId: z.number() }))
  .handler(async ({ data }) => {
    const encounters = await db.encounter.findMany({
      where: { routeId: data.routeId },
      include: {
        species: true,
      },
      orderBy: [{ chance: "desc" }, { speciesId: "asc" }],
    });

    // Get caught statuses for this save
    const speciesIds = [...new Set(encounters.map((e) => e.speciesId))];
    const caughtStatuses = await db.caughtStatus.findMany({
      where: {
        saveId: data.saveId,
        speciesId: { in: speciesIds },
      },
      select: { speciesId: true },
    });

    const caughtSet = new Set(caughtStatuses.map((cs) => cs.speciesId));

    // Group encounters by species (one entry per species, listing all methods)
    const speciesMap = new Map<
      number,
      {
        species: (typeof encounters)[0]["species"];
        caught: boolean;
        methods: Array<{
          method: string;
          minLevel: number | null;
          maxLevel: number | null;
          chance: number | null;
        }>;
      }
    >();

    for (const enc of encounters) {
      if (!speciesMap.has(enc.speciesId)) {
        speciesMap.set(enc.speciesId, {
          species: enc.species,
          caught: caughtSet.has(enc.speciesId),
          methods: [],
        });
      }
      speciesMap.get(enc.speciesId)!.methods.push({
        method: enc.method,
        minLevel: enc.minLevel,
        maxLevel: enc.maxLevel,
        chance: enc.chance,
      });
    }

    return [...speciesMap.values()];
  });

export default getRouteEncounters;
