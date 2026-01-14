import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import viteTsConfigPaths from "vite-tsconfig-paths";
import { URL } from "url";

import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  resolve: {
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
  ssr: {
    external: ["@tanstack/react-devtools", "@tanstack/react-router-devtools"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Separate CSV parser into its own chunk
          if (id.includes("node_modules/papaparse")) {
            return "csv-parser";
          }
          // Separate Yjs collaboration core
          if (id.includes("node_modules/yjs")) {
            return "collab-core";
          }
          // Group Radix UI components
          if (id.includes("node_modules/@radix-ui")) {
            return "radix-ui";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    devtools(),
    nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
  ],
});

export default config;
