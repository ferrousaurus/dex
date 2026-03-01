import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const toggleCaught = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ saveId: z.number(), speciesId: z.number() }).parse(input))
  .handler(async ({ data }) => {
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
