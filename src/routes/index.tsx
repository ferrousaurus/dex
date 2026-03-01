import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/components/Pages/HomePage.tsx";
import getSaves from "@/server/saves/getSaves.ts";
import getGames from "@/server/games/getGames.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    const [saves, games] = await Promise.all([getSaves(), getGames()]);
    return { saves, games };
  },
  component: HomePage,
});
