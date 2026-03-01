import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.ts";
import ensureSaveOwnership from "../saves/ensureSaveOwnership.ts";

const getRoutes = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator((input) =>
    z.object({ gameId: z.number(), saveId: z.number() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    await ensureSaveOwnership(data.saveId, context.userId);

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
