import { ClientEnvironmentSchema } from "./schemas.ts";

async function getServerEnv() {
  const { load } = await import("@std/dotenv");
  const denoenv = Deno.env.toObject();
  const envfile = await load({
    envPath: ".env",
  });
  const envlocal = await load({
    envPath: ".env.local",
  });
  return {
    ...envfile,
    ...envlocal,
    ...denoenv,
  };
}

const env = ClientEnvironmentSchema.parse(
  import.meta.env ?? (await getServerEnv()),
);

export default env;
