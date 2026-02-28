import z from "zod";

export const ClientEnvironmentSchema = z.object({
  VITE_BETTER_AUTH_URL: z.string(),
  VITE_DISCORD_CLIENT_ID: z.string(),
});

export const ServerEnvironmentSchema = ClientEnvironmentSchema.extend({
  BETTER_AUTH_SECRET: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  DATABASE_URL: z.string(),
});
