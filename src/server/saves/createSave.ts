import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authentication from "../middleware/authentication.ts";

const createSave = createServerFn({ method: "POST" })
  .middleware([authentication])
  .inputValidator((input) =>
    z.object({ name: z.string().min(1).max(64), gameId: z.number() }).parse(
      input,
    )
  )
  .handler(async ({ data, context }) => {
    if (!context.userId) throw new Error("Unauthorized");
    return await db.save.create({
      data: { name: data.name, gameId: data.gameId, userId: context.userId },
      include: { game: true },
    });
  });

export default createSave;
