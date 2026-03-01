import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";

const deleteSave = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.number() }))
  .handler(async ({ data }) => {
    await db.save.delete({ where: { id: data.id } });
    return { success: true };
  });

export default deleteSave;
