import { createMiddleware } from "@tanstack/react-start";

const loggingMiddleware = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    return await next();
  },
);

export default loggingMiddleware;
