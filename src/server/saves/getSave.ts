import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authentication from "../middleware/authentication.ts";

const getSave = createServerFn({ method: "GET" })
  .middleware([authentication])
  .inputValidator((input) => z.object({ id: z.number() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
    const save = await db.save.findUnique({
      where: { id: data.id },
      include: { game: true },
    });

    if (!save || save.userId !== context.userId) {
      throw new Error("Save not found");
    }

    return save;
  });

export default getSave;
