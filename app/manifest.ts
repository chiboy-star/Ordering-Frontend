import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "pickNdrop — Campus Dining",
    short_name: "pickNdrop",
    description: "Skip the wait, savor the flavor. Campus food ordering and peer delivery at Pan-Atlantic University.",
    start_url: "/",
    id: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0400FF",
    orientation: "portrait",
    scope: "/",
    categories: ["food", "lifestyle", "shopping"],
    shortcuts: [
      {
        name: "Campus Menu",
        url: "/menu",
        description: "Browse today's cafeteria meals and snacks",
      },
      {
        name: "My Orders",
        url: "/orders",
        description: "Track live campus orders and pickups",
      },
    ],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
