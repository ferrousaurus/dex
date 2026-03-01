import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authMiddleware from "../middleware/authMiddleware.ts";
import ensureSaveOwnership from "../saves/ensureSaveOwnership.ts";

const toggleCaught = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((input) =>
    z.object({ saveId: z.number(), speciesId: z.number() }).parse(input)
  )
  .handler(async ({ data, context }) => {
    await ensureSaveOwnership(data.saveId, context.userId);

    const existing = await db.caughtStatus.findUnique({
      where: {
        saveId_speciesId: { saveId: data.saveId, speciesId: data.speciesId },
      },
    });

    if (existing) {
      await db.caughtStatus.delete({ where: { id: existing.id } });
      return { caught: false };
    } else {
      await db.caughtStatus.create({
        data: { saveId: data.saveId, speciesId: data.speciesId },
      });
      return { caught: true };
    }
  });

export default toggleCaught;
