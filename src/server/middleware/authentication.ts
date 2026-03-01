import { createMiddleware } from "@tanstack/react-start";
import ensureSession from "../auth/ensureSession.ts";

const authentication = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await ensureSession();

    return next({ context: { userId: session?.user.id } });
  },
);

export default authentication;
