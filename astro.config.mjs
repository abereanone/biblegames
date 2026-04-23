import { defineConfig } from "astro/config";
import path from "node:path";

export default defineConfig({
  site: "https://biblegames.local",
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
  },
});
