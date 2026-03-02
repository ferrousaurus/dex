import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authentication from "@/server/middleware/authentication.ts";

const getSave = createServerFn({ method: "GET" })
  .middleware([authentication])
  .inputValidator(z.object({ id: z.number() }))
  .handler(async ({ data, context }) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }

    const save = await db.save.findUnique({
      where: { id: data.id, userId: context.userId },
      include: { game: true },
    });

    if (!save) {
      throw new Error("Save not found");
    }

    return save;
  });

export default getSave;
