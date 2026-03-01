import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authentication from "../middleware/authentication.ts";
import ensureSaveOwnership from "./ensureSaveOwnership.ts";

const getProgress = createServerFn({ method: "GET" })
  .middleware([authentication])
  .inputValidator((input) => z.object({ saveId: z.number() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
    const save = await ensureSaveOwnership(data.saveId, context.userId);

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
