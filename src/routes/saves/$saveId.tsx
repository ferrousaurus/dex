import { createFileRoute } from "@tanstack/react-router";
import getSave from "@/server/saves/getSave.ts";
import getRoutes from "@/server/routes/getRoutes.ts";
import SavePage from "@/components/Pages/SavePage.tsx";

export const Route = createFileRoute("/saves/$saveId")({
  loader: async ({ params }) => {
    const saveId = Number(params.saveId);
    const save = await getSave({ data: { id: saveId } });
    if (!save) throw new Error("Save not found");
    const routes = await getRoutes({
      data: { gameId: save.gameId, saveId },
    });
    return { save, routes };
  },
  component: SavePage,
});
