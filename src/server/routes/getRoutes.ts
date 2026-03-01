import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const getRoutes = createServerFn({ method: "GET" })
  .validator(z.object({ gameId: z.number(), saveId: z.number() }))
  .handler(async ({ data }) => {
    const routes = await db.route.findMany({
      where: { gameId: data.gameId },
      include: {
        encounters: {
          select: { speciesId: true },
          distinct: ["speciesId"],
        },
      },
      orderBy: { name: "asc" },
    });

    // Get caught species for this save
    const caughtStatuses = await db.caughtStatus.findMany({
      where: { saveId: data.saveId },
      select: { speciesId: true },
    });

    const caughtSet = new Set(caughtStatuses.map((cs) => cs.speciesId));

    return routes.map((route) => {
      const speciesIds = route.encounters.map((e) => e.speciesId);
      const uniqueSpeciesIds = [...new Set(speciesIds)];
      const caughtCount = uniqueSpeciesIds.filter((id) =>
        caughtSet.has(id)
      ).length;
      return {
        id: route.id,
        name: route.name,
        slug: route.slug,
        totalSpecies: uniqueSpeciesIds.length,
        caughtCount,
      };
    });
  });

export default getRoutes;
