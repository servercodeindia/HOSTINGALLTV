import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db";
import { movies } from "../shared/schema";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ---------------- API ---------------- */

app.get("/api/health", async (_req, res) => {
  try {
    await db.select().from(movies).limit(1);
    res.json({ ok: true, db: "connected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "DB failed" });
  }
});

app.get("/api/movies", async (_req, res) => {
  const data = await db.select().from(movies);
  res.json(data);
});

/* ---------------- CLIENT ---------------- */

const clientPath = path.join(__dirname, "..", "dist", "client");
app.use(express.static(clientPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

/* ---------------- START ---------------- */

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
