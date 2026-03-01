import { createMiddleware } from "@tanstack/react-start";
import ensureSession from "../auth/ensureSession.ts";

const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await ensureSession();
    if (session === undefined || session.user === undefined) {
      throw new Error("Unauthorized");
    }
    return next({ context: { userId: session.user.id } });
  },
);

export default authMiddleware;
