import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import getSave from "@/server/saves/getSave.ts";
import { SimpleGrid } from "@mantine/core";
import { Save } from "~/prisma/generated/client.ts";

export const Route = createFileRoute("/saves/$saveId/routes/")({
  component: () => {
    const params = Route.useParams();

    if (!params.saveId) {
      throw new Error("saveId is required");
    }

    const saveId = Number(params.saveId);

    if (isNaN(saveId)) {
      throw new Error("saveId is required");
    }

    return <SaveRoutesPage saveId={saveId} />;
  },
});

type SavePageProps = {
  saveId: Save["id"];
};

function SaveRoutesPage({ saveId }: Readonly<SavePageProps>) {
  const _saves = useQuery({
    queryKey: ["saves", saveId],
    queryFn: () => getSave({ data: { id: saveId } }),
  });

  return <SimpleGrid cols={4}></SimpleGrid>;
}
