import { createMiddleware } from "@tanstack/react-start";

const logging = createMiddleware({ type: "function" }).server(
  async ({ next }) => {
    return await next();
  },
);

export default logging;
