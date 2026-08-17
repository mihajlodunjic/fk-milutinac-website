import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const siteUrl = process.env.PUBLIC_SITE_URL || "http://localhost:4321";

export default defineConfig({
  site: siteUrl,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith("/404/")
    })
  ],
  vite: {
    build: {
      assetsInlineLimit: 0
    }
  }
});
