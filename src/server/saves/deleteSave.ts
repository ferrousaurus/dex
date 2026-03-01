import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import { z } from "zod";
import authentication from "../middleware/authentication.ts";
import ensureSaveOwnership from "./ensureSaveOwnership.ts";

const deleteSave = createServerFn({ method: "POST" })
  .middleware([authentication])
  .inputValidator((input) => z.object({ id: z.number() }).parse(input))
  .handler(async ({ data, context }) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }

    await ensureSaveOwnership(data.id, context.userId);

    await db.save.delete({ where: { id: data.id } });
    return { success: true };
  });

export default deleteSave;
