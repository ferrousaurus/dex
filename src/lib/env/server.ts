import { load } from "@std/dotenv";
import { ServerEnvironmentSchema } from "./schemas.ts";

const denoenv = Deno.env.toObject();

const envfile = await load({
  envPath: ".env",
});

const envlocal = await load({
  envPath: ".env.local",
});

const env = ServerEnvironmentSchema.parse({
  ...envfile,
  ...envlocal,
  ...denoenv,
});

export default env;
