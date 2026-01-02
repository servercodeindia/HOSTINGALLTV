import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- API example ----
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  // DEV: mount Vite
  const { createServer: createViteServer } = await import("vite");

  const vite = await createViteServer({
    root: path.resolve(__dirname, "../client"),
    server: { middlewareMode: true },
    appType: "custom"
  });

  app.use(vite.middlewares);
} else {
  // PROD: serve built files
  const clientDist = path.resolve(__dirname, "../client/dist");
  app.use(express.static(clientDist));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const PORT = Number(process.env.PORT) || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
