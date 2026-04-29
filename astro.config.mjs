import { defineConfig } from "astro/config";
import path from "node:path";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://biblegames.local",

  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },

  adapter: cloudflare()
});