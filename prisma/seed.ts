import { PrismaClient } from "./generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import env from "@/lib/env/server.ts";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.user.findMany();
}

main()
  .then(() => {
    console.log("Seeding completed successfully.");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
