import { useState } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { useMovies, useCreateMovie, useDeleteMovie, useUpdateMovie } from "@/hooks/use-movies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Search, Star, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMovieSchema, type Movie } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminMovies() {
  const { data: movies, isLoading } = useMovies();
  const deleteMovie = useDeleteMovie();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  const form = useForm({
    resolver: zodResolver(insertMovieSchema),
    defaultValues: {
      title: "",
      description: "",
      posterUrl: "",
      backdropUrl: "",
      videoUrl: "",
      duration: 120,
      rating: "PG-13",
      genre: "Action",
      isFeatured: false,
      isTrending: false,
    },
  });

  const onSubmit = async (data: any) => {
    if (editingMovie) {
      await updateMovie.mutateAsync({ id: editingMovie.id, ...data });
      setEditingMovie(null);
    } else {
      await createMovie.mutateAsync(data);
    }
    setOpen(false);
    form.reset();
  };

  const filteredMovies = movies?.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Movies Library</h2>
          <p className="text-muted-foreground">Manage your movie catalog</p>
        </div>
        
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setEditingMovie(null);
            form.reset();
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" /> Add Movie
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
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

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (min)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="bg-black/20 border-white/10" />
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

                <FormField
                  control={form.control}
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

                <div className="flex gap-6 py-2">
                  <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Featured on Home</FormLabel>
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

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={createMovie.isPending || updateMovie.isPending}>
                  {editingMovie 
                    ? (updateMovie.isPending ? "Updating..." : "Update Movie")
                    : (createMovie.isPending ? "Adding..." : "Add Movie")
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
          placeholder="Search movies..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 p-0 h-auto text-white placeholder:text-muted-foreground"
        />
      </div>

      <div className="rounded-xl border border-white/5 overflow-hidden bg-card/30 backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="text-white">Movie</TableHead>
              <TableHead className="text-white">Genre</TableHead>
              <TableHead className="text-white">Duration</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading movies...</TableCell>
              </TableRow>
            ) : filteredMovies?.map((movie) => (
              <TableRow key={movie.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="font-medium text-white flex items-center gap-3">
                  <img src={movie.posterUrl} className="w-8 h-12 rounded object-cover bg-gray-800" alt="" />
                  {movie.title}
                </TableCell>
                <TableCell className="text-muted-foreground">{movie.genre}</TableCell>
                <TableCell className="text-muted-foreground">{movie.duration} min</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {movie.isFeatured && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full border border-yellow-500/20">Featured</span>}
                    {movie.isTrending && <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded-full border border-red-500/20">Trending</span>}
                  </div>
                </TableCell>
                <TableCell className="text-right space-x-2 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                    onClick={() => {
                      setEditingMovie(movie);
                      form.reset({
                        title: movie.title,
                        description: movie.description,
                        posterUrl: movie.posterUrl,
                        backdropUrl: movie.backdropUrl,
                        videoUrl: movie.videoUrl,
                        duration: movie.duration,
                        rating: movie.rating,
                        genre: movie.genre,
                        isFeatured: movie.isFeatured,
                        isTrending: movie.isTrending,
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
                      if (confirm("Are you sure you want to delete this movie?")) {
                        deleteMovie.mutate(movie.id);
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
    </AdminLayout>
  );
}
