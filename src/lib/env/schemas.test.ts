import { assert, assertEquals } from "@std/assert";
import { ClientEnvironmentSchema, ServerEnvironmentSchema } from "./schemas.ts";

const validClient = {
  VITE_BETTER_AUTH_URL: "http://localhost:3000",
  VITE_DISCORD_CLIENT_ID: "discord-client-id",
};

const validServer = {
  ...validClient,
  BETTER_AUTH_SECRET: "supersecret",
  DISCORD_CLIENT_SECRET: "discord-secret",
  DATABASE_URL: "postgresql://localhost:5432/mydb",
};

Deno.test("ClientEnvironmentSchema - accepts valid input", () => {
  const result = ClientEnvironmentSchema.safeParse(validClient);
  assertEquals(result.success, true);
});

Deno.test("ClientEnvironmentSchema - rejects missing VITE_BETTER_AUTH_URL", () => {
  const { VITE_BETTER_AUTH_URL: _, ...rest } = validClient;
  const result = ClientEnvironmentSchema.safeParse(rest);
  assertEquals(result.success, false);
});

Deno.test("ClientEnvironmentSchema - rejects missing VITE_DISCORD_CLIENT_ID", () => {
  const { VITE_DISCORD_CLIENT_ID: _, ...rest } = validClient;
  const result = ClientEnvironmentSchema.safeParse(rest);
  assertEquals(result.success, false);
});

Deno.test("ClientEnvironmentSchema - rejects empty object", () => {
  const result = ClientEnvironmentSchema.safeParse({});
  assertEquals(result.success, false);
});

Deno.test("ServerEnvironmentSchema - accepts valid input", () => {
  const result = ServerEnvironmentSchema.safeParse(validServer);
  assertEquals(result.success, true);
});

Deno.test("ServerEnvironmentSchema - rejects missing BETTER_AUTH_SECRET", () => {
  const { BETTER_AUTH_SECRET: _, ...rest } = validServer;
  const result = ServerEnvironmentSchema.safeParse(rest);
  assertEquals(result.success, false);
});

Deno.test("ServerEnvironmentSchema - rejects missing DATABASE_URL", () => {
  const { DATABASE_URL: _, ...rest } = validServer;
  const result = ServerEnvironmentSchema.safeParse(rest);
  assertEquals(result.success, false);
});

Deno.test("ServerEnvironmentSchema - rejects missing DISCORD_CLIENT_SECRET", () => {
  const { DISCORD_CLIENT_SECRET: _, ...rest } = validServer;
  const result = ServerEnvironmentSchema.safeParse(rest);
  assertEquals(result.success, false);
});

Deno.test("ServerEnvironmentSchema - rejects client-only input", () => {
  const result = ServerEnvironmentSchema.safeParse(validClient);
  assertEquals(result.success, false);
});

Deno.test("ServerEnvironmentSchema - parsed output contains all fields", () => {
  const result = ServerEnvironmentSchema.safeParse(validServer);
  assert(result.success);
  assertEquals(
    result.data.VITE_BETTER_AUTH_URL,
    validServer.VITE_BETTER_AUTH_URL,
  );
  assertEquals(result.data.DATABASE_URL, validServer.DATABASE_URL);
});

Deno.test("ClientEnvironmentSchema - rejects null field values", () => {
  const result = ClientEnvironmentSchema.safeParse({
    VITE_BETTER_AUTH_URL: null,
    VITE_DISCORD_CLIENT_ID: "id",
  });
  assertEquals(result.success, false);
});

Deno.test("ClientEnvironmentSchema - rejects numeric field values", () => {
  const result = ClientEnvironmentSchema.safeParse({
    VITE_BETTER_AUTH_URL: 42,
    VITE_DISCORD_CLIENT_ID: "id",
  });
  assertEquals(result.success, false);
});

Deno.test("ClientEnvironmentSchema - strips extra fields", () => {
  const result = ClientEnvironmentSchema.safeParse({
    ...validClient,
    EXTRA_KEY: "should-not-appear",
  });
  assert(result.success);
  assertEquals("EXTRA_KEY" in result.data, false);
});

Deno.test("ServerEnvironmentSchema - strips extra fields", () => {
  const result = ServerEnvironmentSchema.safeParse({
    ...validServer,
    EXTRA_KEY: "should-not-appear",
  });
  assert(result.success);
  assertEquals("EXTRA_KEY" in result.data, false);
});

Deno.test("ClientEnvironmentSchema - accepts empty string values", () => {
  const result = ClientEnvironmentSchema.safeParse({
    VITE_BETTER_AUTH_URL: "",
    VITE_DISCORD_CLIENT_ID: "",
  });
  assertEquals(result.success, true);
});
