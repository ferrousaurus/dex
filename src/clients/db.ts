import { PrismaClient } from "~/prisma/generated/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import env from "@/lib/env/server.ts";

const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
});

const db = new PrismaClient({
  adapter,
});

export default db;
