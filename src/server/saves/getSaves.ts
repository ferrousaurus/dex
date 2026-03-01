import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";

const getSaves = createServerFn({ method: "GET" }).handler(async () => {
  return await db.save.findMany({
    orderBy: { createdAt: "desc" },
    include: { game: true },
  });
});

export default getSaves;
