import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const getSave = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    return await db.save.findUnique({
      where: { id: data.id },
      include: { game: true },
    });
  });

export default getSave;
