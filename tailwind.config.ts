import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ocean: { light: "#8CC3E3", DEFAULT: "#5FA8D3", deep: "#3E86B5" },
        sand: "#EBD9A6",
        leaf: { light: "#9CC661", DEFAULT: "#79AC48", dark: "#5D8F38" },
        navy: { DEFAULT: "#1B2A41", deep: "#131F31", card: "#22334E" },
        coral: { DEFAULT: "#F4877F", dark: "#E06A62" },
        sky: { pill: "#A9D9EE" },
        banana: "#F5CE45",
        flame: "#F0883E",
        ink: "#2F2013"
      },
      fontFamily: {
        display: ['"Patrick Hand"', '"Comic Sans MS"', '"Segoe Print"', 'cursive'],
        sans: ['Nunito', 'ui-rounded', '"Segoe UI"', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: "0 4px 14px rgba(19, 31, 49, 0.10)",
        pill: "0 3px 0 rgba(47, 32, 19, 0.35)"
      }
    }
  },
  plugins: []
};
export default config;
