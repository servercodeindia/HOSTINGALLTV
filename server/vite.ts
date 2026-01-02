import { createServer as createViteServer } from "vite";
import type { Server } from "http";
import type { Express } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(server: Server, app: Express) {
  const vite = await createViteServer({
    root: path.resolve(__dirname, "../client"),
    server: {
      middlewareMode: true
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "../client/src"),
        "@shared": path.resolve(__dirname, "../shared")
      }
    }
  });

  app.use(vite.middlewares);
}
