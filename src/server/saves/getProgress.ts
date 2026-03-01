import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const getProgress = createServerFn({ method: "GET" })
  .validator(z.object({ saveId: z.number() }))
  .handler(async ({ data }) => {
    const save = await db.save.findUnique({
      where: { id: data.saveId },
      select: { gameId: true },
    });

    if (!save) throw new Error("Save not found");

    // Total unique species available in this game
    const totalSpeciesResult = await db.encounter.findMany({
      where: { route: { gameId: save.gameId } },
      select: { speciesId: true },
      distinct: ["speciesId"],
    });

    const totalSpecies = totalSpeciesResult.length;

    // Total caught in this save
    const caught = await db.caughtStatus.count({
      where: { saveId: data.saveId },
    });

    return { totalSpecies, caught };
  });

export default getProgress;
