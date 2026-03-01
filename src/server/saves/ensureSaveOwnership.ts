import db from "@/clients/db.ts";

export default async function ensureSaveOwnership(
  saveId: number,
  userId: string,
) {
  const save = await db.save.findUnique({
    where: { id: saveId },
    select: { id: true, userId: true, gameId: true },
  });

  if (!save || save.userId !== userId) {
    throw new Error("Save not found");
  }

  return save;
}
