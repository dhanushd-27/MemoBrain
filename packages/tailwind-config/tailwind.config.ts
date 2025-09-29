import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {},
  },
  content: ["../../apps/landing/app/**/*.{js,ts,jsx,tsx}", "../../apps/client/src/**/*.{js,ts,jsx,tsx}"],
};

export default config;