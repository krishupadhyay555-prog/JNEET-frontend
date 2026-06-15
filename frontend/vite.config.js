import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        // Log proxy errors in development
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.warn("[Proxy Error]", err.message);
          });
        },
      },
    },
  },
});