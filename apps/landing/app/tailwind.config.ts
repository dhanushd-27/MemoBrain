import type { Config } from "tailwindcss";
import tailwindConfig from "@repo/tailwind-config/tailwind.config";

const config: Config = {
  presets: [tailwindConfig],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;