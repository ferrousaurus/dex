import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";
import authMiddleware from "../middleware/authMiddleware.ts";

const getSaves = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return await db.save.findMany({
      where: { userId: context.userId },
      orderBy: { createdAt: "desc" },
      include: { game: true },
    });
  });

export default getSaves;
