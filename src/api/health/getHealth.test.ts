import { assertEquals } from "jsr:@std/assert";
import { getHealth } from "./getHealth.ts";

Deno.test("getHealth - returns 200 status", () => {
  const response = getHealth();
  assertEquals(response.status, 200);
});

Deno.test("getHealth - returns application/json content type", () => {
  const response = getHealth();
  assertEquals(response.headers.get("Content-Type"), "application/json");
});

Deno.test("getHealth - body contains status ok", async () => {
  const response = getHealth();
  const body = await response.json();
  assertEquals(body, { status: "ok" });
});
