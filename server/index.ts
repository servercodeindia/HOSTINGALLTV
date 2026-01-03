import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Needed for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------
// API ROUTES GO HERE
// app.use("/api", apiRouter);
// --------------------

/**
 * PRODUCTION: serve Vite build
 * IMPORTANT:
 * Vite builds to: dist/client
 * NOT client/dist
 */
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "..", "dist", "client");

  app.use(express.static(clientDistPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
