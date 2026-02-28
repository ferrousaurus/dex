import { createAuthClient } from "better-auth/react";
import env from "@/lib/env/client.ts";

const auth = createAuthClient({
  baseURL: env.VITE_BETTER_AUTH_URL,
});

export default auth;
