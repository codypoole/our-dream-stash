import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const base = mode === "production" ? "/our-dream-stash/" : "/";
  return {
  base,
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      },
      manifest: {
        name: "Our Dream Stash",
        short_name: "Stash",
        description: "A shared wish list for the family",
        theme_color: "#0e1018",
        background_color: "#0e1018",
        display: "standalone",
        start_url: base,
        icons: [
          {
            src: `${base}pwa-192.png`,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: `${base}pwa-512.png`,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@radix-ui/react-tooltip"],
    force: true,
  },
};
});
