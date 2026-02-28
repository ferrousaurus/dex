import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import deno from "@deno/vite-plugin";
import { nitro } from "nitro/vite";
import path from "node:path";
import { devtools as tanstackDevtools } from "@tanstack/devtools-vite";

const nodeBuiltIns = [
  "events",
  "https",
  "http",
  "net",
  "tls",
  "crypto",
  "stream",
  "url",
  "zlib",
  "buffer",
];

export default defineConfig({
  plugins: [
    tanstackDevtools(),
    deno(),
    tanstackStart({}),
    nitro({
      preset: "deno_server",
      rollupConfig: {
        onwarn(warning, warn) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE"
          ) {
            return;
          }
          warn(warning);
        },
      },
    }),
    // react's vite plugin must come after start's vite plugin
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "."),
      ...(nodeBuiltIns.reduce((acc, moduleName) => {
        acc[moduleName] = `node:${moduleName}`;
        return acc;
      }, {} as Record<string, string>)),
    },
  },
  server: {
    port: 3000,
  },
});
