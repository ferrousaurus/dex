import { createServerFn } from "@tanstack/react-start";
import db from "@/clients/db.ts";

const getGames = createServerFn({ method: "GET" }).handler(async () => {
  return await db.game.findMany({ orderBy: { id: "asc" } });
});

export default getGames;
