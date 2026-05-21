/* global process */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      VitePWA({
        // 'prompt' forces the user to accept the update.
        // Do not use 'autoUpdate' to prevent cache conflicts during development.
        registerType: "prompt",

        // Core assets to cache immediately for offline load
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg",
        ],

        // Web App Manifest configuration
        manifest: {
          name: "Puericulture Platform",
          short_name: "PueriApp",
          description:
            "Second-hand, leasing, trading, and forward trading platform.",
          theme_color: "#ffffff", // Mobile status bar color
          background_color: "#ffffff", // Splash screen color
          display: "standalone", // CRITICAL: Hides the browser UI
          orientation: "portrait",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable", // Required for Android icon adaptation
            },
          ],
        },

        // Workbox configuration for caching strategy
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"], // Cache all front-end assets
          cleanupOutdatedCaches: true,
          sourcemap: true,
        },
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "/api",
          changeOrigin: true,
        },
      },
    },
  };
});
