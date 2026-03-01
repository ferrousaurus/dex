import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const renameSave = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ id: z.number(), name: z.string().min(1).max(64) }).parse(input)
  )
  .handler(async ({ data }) => {
    return await db.save.update({
      where: { id: data.id },
      data: { name: data.name },
      include: { game: true },
    });
  });

export default renameSave;
