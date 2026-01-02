import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: "client",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:5000"
    }
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true
  }
});
