import { betterAuth } from "better-auth";
import env from "@/lib/env/server.ts";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "@/clients/db.ts";
import { tanstackStartCookies } from "better-auth/tanstack-start";

export const auth = betterAuth({
  baseURL: env.VITE_BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  plugins: [tanstackStartCookies()],
  socialProviders: {
    discord: {
      clientId: env.VITE_DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
});
