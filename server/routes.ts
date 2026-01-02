import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Movies
  app.get(api.movies.list.path, async (req, res) => {
    const movies = await storage.getMovies();
    res.json(movies);
  });

  app.get(api.movies.get.path, async (req, res) => {
    const movie = await storage.getMovie(Number(req.params.id));
    if (!movie) return res.status(404).json({ message: "Not found" });
    res.json(movie);
  });

  app.post(api.movies.create.path, async (req, res) => {
    const movie = await storage.createMovie(req.body);
    res.status(201).json(movie);
  });

  app.put(api.movies.update.path, async (req, res) => {
    const movie = await storage.updateMovie(Number(req.params.id), req.body);
    if (!movie) return res.status(404).json({ message: "Not found" });
    res.json(movie);
  });

  app.delete(api.movies.delete.path, async (req, res) => {
    await storage.deleteMovie(Number(req.params.id));
    res.status(204).send();
  });

  // Series
  app.get(api.series.list.path, async (req, res) => {
    const s = await storage.getSeries();
    res.json(s);
  });

  app.get(api.series.get.path, async (req, res) => {
    const s = await storage.getSeriesById(Number(req.params.id));
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  });

  app.post(api.series.create.path, async (req, res) => {
    const s = await storage.createSeries(req.body);
    res.status(201).json(s);
  });

  app.put("/api/series/:id", async (req, res) => {
    const s = await storage.updateSeries(Number(req.params.id), req.body);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  });

  app.delete("/api/series/:id", async (req, res) => {
    await storage.deleteSeries(Number(req.params.id));
    res.status(204).send();
  });

  // Episodes
  app.get(api.episodes.list.path, async (req, res) => {
    const eps = await storage.getEpisodes(Number(req.params.seriesId));
    res.json(eps);
  });

  app.post(api.episodes.create.path, async (req, res) => {
    const ep = await storage.createEpisode(req.body);
    res.status(201).json(ep);
  });

  // Analytics - Active Users
  app.get("/api/analytics/active-users-by-device", async (req, res) => {
    const users = await storage.getActiveUsersByDevice();
    res.json(users);
  });

  app.get("/api/analytics/total-active-users", async (req, res) => {
    const total = await storage.getTotalActiveUsers();
    res.json({ total });
  });

  app.post("/api/analytics/track-user", async (req, res) => {
    const { deviceId, deviceType } = req.body;
    await storage.trackActiveUser({ deviceId, deviceType });
    res.status(201).json({ success: true });
  });

  // Analytics - Stream Views
  app.get("/api/analytics/stream-views", async (req, res) => {
    const views = await storage.getStreamViews();
    res.json(views);
  });

  app.get("/api/analytics/total-stream-views", async (req, res) => {
    const total = await storage.getTotalStreamViews();
    res.json({ total });
  });

  app.post("/api/analytics/record-view", async (req, res) => {
    const { contentId, contentType } = req.body;
    await storage.recordStreamView(contentId, contentType);
    res.status(201).json({ success: true });
  });

  await seed();

  return httpServer;
}

async function seed() {
  const movies = await storage.getMovies();
  if (movies.length === 0) {
    await storage.createMovie({
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      duration: 148,
      rating: "PG-13",
      genre: "Sci-Fi",
      isFeatured: true,
      isTrending: false,
      releaseDate: new Date("2010-07-16")
    });

    await storage.createMovie({
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      posterUrl: "https://images.unsplash.com/photo-1509347528160-9a9e33742cd4?auto=format&fit=crop&w=600&q=80",
      backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e63?auto=format&fit=crop&w=1200&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      duration: 152,
      rating: "PG-13",
      genre: "Action",
      isFeatured: false,
      isTrending: true,
      releaseDate: new Date("2008-07-18")
    });
  }
}
