import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const createSave = createServerFn({ method: "POST" })
  .inputValidator((input) => z.object({ name: z.string().min(1).max(64), gameId: z.number() }).parse(input))
  .handler(async ({ data }) => {
    return await db.save.create({
      data: { name: data.name, gameId: data.gameId },
      include: { game: true },
    });
  });

export default createSave;
