import type { MetadataRoute } from "next";

/**
 * Lets the game be added to a phone's home screen and open without browser
 * chrome. `portrait` matches the layout, which is a single narrow column.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Grind — from nothing to a million",
    short_name: "Grind",
    description:
      "A pixel game where your double sits at a desk. You do the real work; they live on it, pay the rent and move up in the world.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#12121a",
    theme_color: "#12121a",
    categories: ["productivity", "games"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  };
}
