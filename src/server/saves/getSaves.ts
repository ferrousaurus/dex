import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import db from "@/clients/db.ts";
import { auth } from "@/lib/auth.ts";

const getSaves = createServerFn({ method: "GET" }).handler(async () => {
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });

  if (!session?.user) {
    return [];
  }

  return await db.save.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { game: true },
  });
});

export default getSaves;
