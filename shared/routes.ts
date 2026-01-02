import { z } from 'zod';
import { insertMovieSchema, insertSeriesSchema, insertEpisodeSchema, movies, series, episodes } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  movies: {
    list: {
      method: 'GET' as const,
      path: '/api/movies',
      responses: {
        200: z.array(z.any()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/movies/:id',
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/movies',
      input: insertMovieSchema,
      responses: {
        201: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/movies/:id',
      input: insertMovieSchema.partial(),
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/movies/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  series: {
    list: {
      method: 'GET' as const,
      path: '/api/series',
      responses: {
        200: z.array(z.any()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/series/:id',
      responses: {
        200: z.any(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/series',
      input: insertSeriesSchema,
      responses: {
        201: z.any(),
      },
    },
  },
  episodes: {
    list: {
      method: 'GET' as const,
      path: '/api/series/:seriesId/episodes',
      responses: {
        200: z.array(z.any()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/episodes',
      input: insertEpisodeSchema,
      responses: {
        201: z.any(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
