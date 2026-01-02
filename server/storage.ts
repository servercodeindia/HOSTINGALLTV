import { db } from "./db";
import { 
  movies, series, episodes, activeUsers, streamViews,
  type Movie, type InsertMovie,
  type Series, type InsertSeries,
  type Episode, type InsertEpisode,
  type ActiveUser, type InsertActiveUser,
  type StreamView, type InsertStreamView
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Movies
  getMovies(): Promise<Movie[]>;
  getMovie(id: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: number, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: number): Promise<void>;
  
  // Series
  getSeries(): Promise<Series[]>;
  getSeriesById(id: number): Promise<Series | undefined>;
  createSeries(series: InsertSeries): Promise<Series>;
  updateSeries(id: number, series: Partial<InsertSeries>): Promise<Series | undefined>;
  deleteSeries(id: number): Promise<void>;
  
  // Episodes
  getEpisodes(seriesId: number): Promise<Episode[]>;
  createEpisode(episode: InsertEpisode): Promise<Episode>;

  // Active Users
  trackActiveUser(user: InsertActiveUser): Promise<ActiveUser>;
  getActiveUsersByDevice(): Promise<Array<{ deviceType: string; count: number }>>;
  getTotalActiveUsers(): Promise<number>;

  // Stream Views
  recordStreamView(contentId: number, contentType: string): Promise<void>;
  getStreamViews(): Promise<StreamView[]>;
  getTotalStreamViews(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getMovies(): Promise<Movie[]> {
    return await db.select().from(movies);
  }

  async getMovie(id: number): Promise<Movie | undefined> {
    const [movie] = await db.select().from(movies).where(eq(movies.id, id));
    return movie;
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const [movie] = await db.insert(movies).values(insertMovie).returning();
    return movie;
  }

  async updateMovie(id: number, updates: Partial<InsertMovie>): Promise<Movie | undefined> {
    const [updated] = await db.update(movies).set(updates).where(eq(movies.id, id)).returning();
    return updated;
  }

  async deleteMovie(id: number): Promise<void> {
    await db.delete(movies).where(eq(movies.id, id));
  }

  async getSeries(): Promise<Series[]> {
    return await db.select().from(series);
  }

  async getSeriesById(id: number): Promise<Series | undefined> {
    const [s] = await db.select().from(series).where(eq(series.id, id));
    return s;
  }

  async createSeries(insertSeries: InsertSeries): Promise<Series> {
    const [s] = await db.insert(series).values(insertSeries).returning();
    return s;
  }

  async updateSeries(id: number, updates: Partial<InsertSeries>): Promise<Series | undefined> {
    const [updated] = await db.update(series).set(updates).where(eq(series.id, id)).returning();
    return updated;
  }

  async deleteSeries(id: number): Promise<void> {
    await db.delete(series).where(eq(series.id, id));
  }

  async getEpisodes(seriesId: number): Promise<Episode[]> {
    return await db.select().from(episodes).where(eq(episodes.seriesId, seriesId));
  }

  async createEpisode(insertEpisode: InsertEpisode): Promise<Episode> {
    const [episode] = await db.insert(episodes).values(insertEpisode).returning();
    return episode;
  }

  async trackActiveUser(user: InsertActiveUser): Promise<ActiveUser> {
    const [activeUser] = await db.insert(activeUsers).values(user).returning();
    return activeUser;
  }

  async getActiveUsersByDevice(): Promise<Array<{ deviceType: string; count: number }>> {
    return await db
      .select({
        deviceType: activeUsers.deviceType,
        count: sql<number>`COUNT(DISTINCT ${activeUsers.deviceId})`.as("count")
      })
      .from(activeUsers)
      .where(sql`${activeUsers.timestamp} > NOW() - INTERVAL '24 hours'`)
      .groupBy(activeUsers.deviceType);
  }

  async getTotalActiveUsers(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${activeUsers.deviceId})`.as("count") })
      .from(activeUsers)
      .where(sql`${activeUsers.timestamp} > NOW() - INTERVAL '24 hours'`);
    return result[0]?.count || 0;
  }

  async recordStreamView(contentId: number, contentType: string): Promise<void> {
    const existing = await db
      .select()
      .from(streamViews)
      .where(sql`${streamViews.contentId} = ${contentId} AND ${streamViews.contentType} = ${contentType}`);
    
    if (existing.length > 0) {
      await db
        .update(streamViews)
        .set({ views: sql`${streamViews.views} + 1` })
        .where(sql`${streamViews.contentId} = ${contentId} AND ${streamViews.contentType} = ${contentType}`);
    } else {
      await db.insert(streamViews).values({ contentId, contentType, views: 1 });
    }
  }

  async getStreamViews(): Promise<StreamView[]> {
    return await db.select().from(streamViews).orderBy(sql`${streamViews.views} DESC`);
  }

  async getTotalStreamViews(): Promise<number> {
    const result = await db.select({ total: sql<number>`SUM(${streamViews.views})`.as("total") }).from(streamViews);
    return result[0]?.total || 0;
  }
}

export const storage = new DatabaseStorage();
