import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

// Static output is Astro's default. Carrier ships zero runtime network
// dependency: every lab must render and run fully offline (ISC-2, ISC-4).
// Interactive widgets hydrate as Svelte islands; everything else is static HTML
// so the no-JS path still serves readable lab text (ISC-35).
export default defineConfig({
  integrations: [svelte()],
});
