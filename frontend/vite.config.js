
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',  // ✅ ensure public bind
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: ['record-frontend.onrender.com'],  // ✅ add your Render domain here
  },
});
