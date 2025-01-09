// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	site: "https://browserports.dev/docs/stealthblock",
	integrations: [
		starlight({
			title: "StealthBlock",
			social: {
				github: "https://github.com/Browser-Ports/StealthBlock"
			},
			sidebar: [
				{
					label: "Spec",
					autogenerate: { directory: "spec" }
				},
				{
					label: "Reference",
					autogenerate: { directory: "reference" }
				}
			]
		})
	]
});
