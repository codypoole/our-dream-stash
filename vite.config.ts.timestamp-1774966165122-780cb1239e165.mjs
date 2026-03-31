// vite.config.ts
import { defineConfig } from "file:///sessions/zen-epic-bohr/mnt/our-dream-stash/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/zen-epic-bohr/mnt/our-dream-stash/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///sessions/zen-epic-bohr/mnt/our-dream-stash/node_modules/lovable-tagger/dist/index.js";
import { VitePWA } from "file:///sessions/zen-epic-bohr/mnt/our-dream-stash/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/sessions/zen-epic-bohr/mnt/our-dream-stash";
var vite_config_default = defineConfig(({ mode }) => {
  const base = mode === "production" ? "/our-dream-stash/" : "/";
  return {
    base,
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false
      }
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          navigateFallbackDenylist: [/^\/~oauth/],
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"]
        },
        manifest: {
          name: "Our Wish List",
          short_name: "Wishes",
          description: "A shared wish list for the family",
          theme_color: "#cc6633",
          background_color: "#f7f3ef",
          display: "standalone",
          start_url: base,
          icons: [
            {
              src: `${base}pwa-192.png`,
              sizes: "192x192",
              type: "image/png"
            },
            {
              src: `${base}pwa-512.png`,
              sizes: "512x512",
              type: "image/png"
            }
          ]
        }
      })
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"]
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@radix-ui/react-tooltip"],
      force: true
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvemVuLWVwaWMtYm9oci9tbnQvb3VyLWRyZWFtLXN0YXNoXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvc2Vzc2lvbnMvemVuLWVwaWMtYm9oci9tbnQvb3VyLWRyZWFtLXN0YXNoL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9zZXNzaW9ucy96ZW4tZXBpYy1ib2hyL21udC9vdXItZHJlYW0tc3Rhc2gvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgbW9kZSB9KSA9PiB7XG4gIGNvbnN0IGJhc2UgPSBtb2RlID09PSBcInByb2R1Y3Rpb25cIiA/IFwiL291ci1kcmVhbS1zdGFzaC9cIiA6IFwiL1wiO1xuICByZXR1cm4ge1xuICBiYXNlLFxuICBzZXJ2ZXI6IHtcbiAgICBob3N0OiBcIjo6XCIsXG4gICAgcG9ydDogODA4MCxcbiAgICBobXI6IHtcbiAgICAgIG92ZXJsYXk6IGZhbHNlLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBWaXRlUFdBKHtcbiAgICAgIHJlZ2lzdGVyVHlwZTogXCJhdXRvVXBkYXRlXCIsXG4gICAgICB3b3JrYm94OiB7XG4gICAgICAgIG5hdmlnYXRlRmFsbGJhY2tEZW55bGlzdDogWy9eXFwvfm9hdXRoL10sXG4gICAgICAgIGdsb2JQYXR0ZXJuczogW1wiKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsd2VicH1cIl0sXG4gICAgICB9LFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgbmFtZTogXCJPdXIgV2lzaCBMaXN0XCIsXG4gICAgICAgIHNob3J0X25hbWU6IFwiV2lzaGVzXCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkEgc2hhcmVkIHdpc2ggbGlzdCBmb3IgdGhlIGZhbWlseVwiLFxuICAgICAgICB0aGVtZV9jb2xvcjogXCIjY2M2NjMzXCIsXG4gICAgICAgIGJhY2tncm91bmRfY29sb3I6IFwiI2Y3ZjNlZlwiLFxuICAgICAgICBkaXNwbGF5OiBcInN0YW5kYWxvbmVcIixcbiAgICAgICAgc3RhcnRfdXJsOiBiYXNlLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogYCR7YmFzZX1wd2EtMTkyLnBuZ2AsXG4gICAgICAgICAgICBzaXplczogXCIxOTJ4MTkyXCIsXG4gICAgICAgICAgICB0eXBlOiBcImltYWdlL3BuZ1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiBgJHtiYXNlfXB3YS01MTIucG5nYCxcbiAgICAgICAgICAgIHNpemVzOiBcIjUxMng1MTJcIixcbiAgICAgICAgICAgIHR5cGU6IFwiaW1hZ2UvcG5nXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gICAgZGVkdXBlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCJdLFxuICB9LFxuICBvcHRpbWl6ZURlcHM6IHtcbiAgICBpbmNsdWRlOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0L2pzeC1ydW50aW1lXCIsIFwicmVhY3QvanN4LWRldi1ydW50aW1lXCIsIFwiQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5XCIsIFwiQHJhZGl4LXVpL3JlYWN0LXRvb2x0aXBcIl0sXG4gICAgZm9yY2U6IHRydWUsXG4gIH0sXG59O1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1ULFNBQVMsb0JBQW9CO0FBQ2hWLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFDaEMsU0FBUyxlQUFlO0FBSnhCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sT0FBTyxTQUFTLGVBQWUsc0JBQXNCO0FBQzNELFNBQU87QUFBQSxJQUNQO0FBQUEsSUFDQSxRQUFRO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsUUFDSCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUFBLE1BQzFDLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLFNBQVM7QUFBQSxVQUNQLDBCQUEwQixDQUFDLFdBQVc7QUFBQSxVQUN0QyxjQUFjLENBQUMscUNBQXFDO0FBQUEsUUFDdEQ7QUFBQSxRQUNBLFVBQVU7QUFBQSxVQUNSLE1BQU07QUFBQSxVQUNOLFlBQVk7QUFBQSxVQUNaLGFBQWE7QUFBQSxVQUNiLGFBQWE7QUFBQSxVQUNiLGtCQUFrQjtBQUFBLFVBQ2xCLFNBQVM7QUFBQSxVQUNULFdBQVc7QUFBQSxVQUNYLE9BQU87QUFBQSxZQUNMO0FBQUEsY0FDRSxLQUFLLEdBQUcsSUFBSTtBQUFBLGNBQ1osT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxZQUNBO0FBQUEsY0FDRSxLQUFLLEdBQUcsSUFBSTtBQUFBLGNBQ1osT0FBTztBQUFBLGNBQ1AsTUFBTTtBQUFBLFlBQ1I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0gsRUFBRSxPQUFPLE9BQU87QUFBQSxJQUNoQixTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDdEM7QUFBQSxNQUNBLFFBQVEsQ0FBQyxTQUFTLGFBQWEscUJBQXFCLHVCQUF1QjtBQUFBLElBQzdFO0FBQUEsSUFDQSxjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsU0FBUyxhQUFhLHFCQUFxQix5QkFBeUIseUJBQXlCLHlCQUF5QjtBQUFBLE1BQ2hJLE9BQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUNBLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
