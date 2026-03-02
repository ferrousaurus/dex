import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authentication from "../middleware/authentication.ts";
import ensureSaveOwnership from "../saves/ensureSaveOwnership.ts";

const getRoutes = createServerFn({ method: "GET" })
  .middleware([authentication])
  .inputValidator((input) =>
    z.object({ gameId: z.number(), saveId: z.number() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
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

    const specialSlugs = [
      "starter",
      "evolution",
      "breed",
      "trade",
      "trade-national",
    ];

    const mapped = routes.map((route) => {
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

    // Natural sort: split into text/number segments and compare pairwise
    const naturalCompare = (a: string, b: string): number => {
      const aParts = a.split(/(\d+)/);
      const bParts = b.split(/(\d+)/);
      for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
        const ap = aParts[i];
        const bp = bParts[i];
        if (ap === bp) continue;
        const aNum = Number(ap);
        const bNum = Number(bp);
        if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
        return ap.localeCompare(bp);
      }
      return aParts.length - bParts.length;
    };

    mapped.sort((a, b) => {
      const aSpecial = specialSlugs.indexOf(a.slug);
      const bSpecial = specialSlugs.indexOf(b.slug);
      const aIsSpecial = aSpecial !== -1;
      const bIsSpecial = bSpecial !== -1;

      // Special routes go to the bottom
      if (aIsSpecial && !bIsSpecial) return 1;
      if (!aIsSpecial && bIsSpecial) return -1;
      if (aIsSpecial && bIsSpecial) return aSpecial - bSpecial;

      return naturalCompare(a.name, b.name);
    });

    return mapped;
  });

export default getRoutes;
