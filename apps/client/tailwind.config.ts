import tailwindThemeConfig from "@repo/tailwind-config/tailwind.config"
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [tailwindThemeConfig],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
};

export default config;