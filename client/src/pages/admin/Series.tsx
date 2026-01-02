import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useSeries, useCreateSeries } from "@/hooks/use-series";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, PlayCircle, Loader2, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSeriesSchema, insertEpisodeSchema, type Series } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminSeries() {
  const { data: series, isLoading } = useSeries();
  const createSeries = useCreateSeries();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [episodesOpen, setEpisodesOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState<Series | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(insertSeriesSchema),
    defaultValues: {
      title: "",
      description: "",
      posterUrl: "",
      backdropUrl: "",
      genre: "Drama",
      rating: "TV-MA",
      isFeatured: false,
      isTrending: false,
    },
  });

  const episodeForm = useForm({
    resolver: zodResolver(insertEpisodeSchema),
    defaultValues: {
      seriesId: 0,
      seasonNumber: 1,
      episodeNumber: 1,
      title: "",
      description: "",
      videoUrl: "",
      duration: 45,
    },
  });

  const onSubmit = async (data: any) => {
    if (editingSeries) {
      const response = await apiRequest("PUT", `/api/series/${editingSeries.id}`, data);
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["/api/series"] });
        toast({ title: "Series updated successfully" });
        setEditingSeries(null);
      }
    } else {
      await createSeries.mutateAsync(data);
    }
    setOpen(false);
    form.reset();
  };

  const deleteSeries = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("DELETE", `/api/series/${id}`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/series"] });
      toast({ title: "Series deleted successfully" });
    },
  });

  const createEpisode = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/episodes", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/episodes"] });
      toast({ title: "Episode added successfully" });
      episodeForm.reset({ ...episodeForm.getValues(), episodeNumber: episodeForm.getValues().episodeNumber + 1, title: "" });
    },
  });

  const filteredSeries = series?.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Series Library</h2>
          <p className="text-muted-foreground">Manage your TV shows and episodes</p>
        </div>
        
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setEditingSeries(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Add Series
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSeries ? "Edit Series" : "Add New Series"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-black/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rating</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-black/20 border-white/10" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="posterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poster URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10" placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="backdropUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Backdrop URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-black/20 border-white/10" placeholder="https://..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-6 py-2">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Featured</FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isTrending"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Trending</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={createSeries.isPending || deleteSeries.isPending}>
                  {editingSeries 
                    ? (deleteSeries.isPending ? "Updating..." : "Update Series")
                    : (createSeries.isPending ? "Adding..." : "Add Series")
                  }
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-2 mb-6 bg-card/50 border border-white/5 rounded-xl px-4 py-2 w-full md:w-96">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search series..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 p-0 h-auto text-white placeholder:text-muted-foreground"
        />
      </div>

      <div className="rounded-xl border border-white/5 overflow-hidden bg-card/30 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white">Series</TableHead>
              <TableHead className="text-white">Genre</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading series...</TableCell>
              </TableRow>
            ) : filteredSeries?.map((s) => (
              <TableRow key={s.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-medium text-white flex items-center gap-3">
                  <img src={s.posterUrl} className="w-8 h-12 rounded object-cover bg-gray-800" alt="" />
                  {s.title}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.genre}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {s.isFeatured && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20">Featured</span>}
                    {s.isTrending && <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded-full border border-red-500/20">Trending</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-green-400 hover:text-green-300 hover:bg-green-400/10"
                    onClick={() => {
                      setSelectedSeriesId(s.id);
                      episodeForm.setValue("seriesId", s.id);
                      setEpisodesOpen(true);
                    }}
                  >
                    <PlayCircle className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    onClick={() => {
                      setEditingSeries(s);
                      form.reset({
                        title: s.title,
                        description: s.description,
                        posterUrl: s.posterUrl,
                        backdropUrl: s.backdropUrl,
                        genre: s.genre,
                        rating: s.rating,
                        isFeatured: s.isFeatured,
                        isTrending: s.isTrending,
                      });
                      setOpen(true);
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this series?")) {
                        deleteSeries.mutate(s.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={episodesOpen} onOpenChange={setEpisodesOpen}>
        <DialogContent className="bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Episode to Series</DialogTitle>
          </DialogHeader>
          <Form {...episodeForm}>
            <form onSubmit={episodeForm.handleSubmit((data) => createEpisode.mutate(data))} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={episodeForm.control}
                  name="seasonNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="bg-black/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={episodeForm.control}
                  name="episodeNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Episode #</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="bg-black/20 border-white/10" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={episodeForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episode Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-black/20 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={episodeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-black/20 border-white/10" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={episodeForm.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-black/20 border-white/10" placeholder="https://..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={createEpisode.isPending}>
                {createEpisode.isPending ? <Loader2 className="animate-spin" /> : "Add Episode"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
