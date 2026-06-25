import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";

import cloudflare from "@astrojs/cloudflare";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
);

export default defineConfig({
  // Canonical production origin — used for canonical URLs, Open Graph and the sitemap.
  site: "https://www.kosmoslodge.co.za",
  output: "hybrid",

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
    }),
  ],

  adapter: cloudflare()
});