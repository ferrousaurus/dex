import { Navigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "~/prisma/generated/client.ts";

export const Route = createFileRoute("/saves/$saveId/")({
  component: () => {
    const params = Route.useParams();

    if (!params.saveId) {
      throw new Error("saveId is required");
    }

    const saveId = Number(params.saveId);

    if (isNaN(saveId)) {
      throw new Error("saveId must be a number");
    }

    return <SavePage saveId={saveId} />;
  },
});

type SavePageProps = {
  saveId: Save["id"];
};

function SavePage({ saveId }: Readonly<SavePageProps>) {
  return (
    <Navigate to="/saves/$saveId/routes" params={{ saveId: String(saveId) }} />
  );
}
