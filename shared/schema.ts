import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  posterUrl: text("poster_url").notNull(),
  backdropUrl: text("backdrop_url").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(), // in minutes
  rating: text("rating").notNull(),
  genre: text("genre").notNull(),
  releaseDate: timestamp("release_date"),
  isFeatured: boolean("is_featured").default(false),
  isTrending: boolean("is_trending").default(false),
});

export const series = pgTable("series", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  posterUrl: text("poster_url").notNull(),
  backdropUrl: text("backdrop_url").notNull(),
  rating: text("rating").notNull(),
  genre: text("genre").notNull(),
  isFeatured: boolean("is_featured").default(false),
  isTrending: boolean("is_trending").default(false),
});

export const episodes = pgTable("episodes", {
  id: serial("id").primaryKey(),
  seriesId: integer("series_id").notNull(), // Foreign key logic handled in app code or relations
  seasonNumber: integer("season_number").notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration"),
});

export const activeUsers = pgTable("active_users", {
  id: serial("id").primaryKey(),
  deviceId: text("device_id").notNull(),
  deviceType: text("device_type").notNull(), // "mobile", "tablet", "desktop"
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const streamViews = pgTable("stream_views", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").notNull(),
  contentType: text("content_type").notNull(), // "movie" or "series"
  views: integer("views").default(0).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Schemas
export const insertMovieSchema = createInsertSchema(movies).omit({ id: true });
export const insertSeriesSchema = createInsertSchema(series).omit({ id: true });
export const insertEpisodeSchema = createInsertSchema(episodes).omit({ id: true });
export const insertActiveUserSchema = createInsertSchema(activeUsers).omit({ id: true });
export const insertStreamViewSchema = createInsertSchema(streamViews).omit({ id: true });

// Types
export type Movie = typeof movies.$inferSelect;
export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Series = typeof series.$inferSelect;
export type InsertSeries = z.infer<typeof insertSeriesSchema>;
export type Episode = typeof episodes.$inferSelect;
export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type ActiveUser = typeof activeUsers.$inferSelect;
export type InsertActiveUser = z.infer<typeof insertActiveUserSchema>;
export type StreamView = typeof streamViews.$inferSelect;
export type InsertStreamView = z.infer<typeof insertStreamViewSchema>;

// Detailed relations/responses
export type SeriesWithEpisodes = Series & { episodes: Episode[] };
