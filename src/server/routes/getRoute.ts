import db from "@/clients/db.ts";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import authentication from "@/server/middleware/authentication.ts";

const getRoute = createServerFn({ method: "GET" })
  .middleware([authentication])
  .inputValidator((input) =>
    z.object({ routeId: z.number(), saveId: z.number() }).parse(input)
  )
  .handler(async ({ data }) => {
    const route = await db.route.findUnique({
      where: { id: data.routeId },
      include: {
        encounters: {
          select: { speciesId: true },
          distinct: ["speciesId"],
        },
      },
    });

    if (route === null) {
      throw new Error("No route found");
    }

    const caughtStatuses = await db.caughtStatus.findMany({
      where: { saveId: data.saveId },
      select: { speciesId: true },
    });

    const speciesIds = new Set(caughtStatuses.map((e) => e.speciesId));

    const uniqueSpeciesIds = [...new Set(speciesIds)];

    const caughtCount = uniqueSpeciesIds.filter((id) =>
      speciesIds.has(id)
    ).length;

    return {
      id: route.id,
      name: route.name,
      slug: route.slug,
      totalSpecies: uniqueSpeciesIds.length,
      caughtCount,
    };
  });

export default getRoute;
