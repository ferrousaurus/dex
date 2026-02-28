import { createMiddleware } from "@tanstack/react-start";
import ensureSession from "../auth/ensureSession.ts";

const authMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    const session = await ensureSession();
    if (session === undefined) {
      throw new Error("");
    }
    return next();
  },
);

export default authMiddleware;
