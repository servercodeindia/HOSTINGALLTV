import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertSeries, type InsertEpisode } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useSeries() {
  return useQuery({
    queryKey: [api.series.list.path],
    queryFn: async () => {
      const res = await fetch(api.series.list.path);
      if (!res.ok) throw new Error("Failed to fetch series");
      return api.series.list.responses[200].parse(await res.json());
    },
  });
}

export function useSeriesDetails(id: number) {
  return useQuery({
    queryKey: [api.series.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.series.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch series details");
      return api.series.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateSeries() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertSeries) => {
      const res = await fetch(api.series.create.path, {
        method: api.series.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create series");
      return api.series.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.series.list.path] });
      toast({ title: "Success", description: "Series created" });
    },
  });
}

export function useEpisodes(seriesId: number) {
  return useQuery({
    queryKey: [api.episodes.list.path, seriesId],
    queryFn: async () => {
      const url = buildUrl(api.episodes.list.path, { seriesId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch episodes");
      return api.episodes.list.responses[200].parse(await res.json());
    },
    enabled: !!seriesId,
  });
}

export function useCreateEpisode() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertEpisode) => {
      const res = await fetch(api.episodes.create.path, {
        method: api.episodes.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create episode");
      return api.episodes.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.episodes.list.path, variables.seriesId] });
      toast({ title: "Success", description: "Episode added" });
    },
  });
}
