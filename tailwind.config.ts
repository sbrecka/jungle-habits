import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#12121a",
        panel: "#1c1c26",
        panel2: "#262632",
        line: "#33333f",
        text: "#e8e6ef",
        dim: "#9a97a8",
        gold: "#e0a53c",
        goldDark: "#a86f20",
        green: "#6aa84f",
        warn: "#d9822b",
        danger: "#c8524f",
        dangerDark: "#8d3634",
        blue: "#6fb1d9"
      },
      fontFamily: {
        display: [
          '"Pixelify Sans"',
          'ui-monospace',
          '"SF Mono"',
          'Menlo',
          'monospace'
        ],
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'sans-serif'
        ]
      }
    }
  },
  plugins: []
};
export default config;
