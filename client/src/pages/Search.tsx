import { useState, useMemo, useEffect } from "react";
import { useMovies } from "@/hooks/use-movies";
import { useSeries } from "@/hooks/use-series";
import { Navigation } from "@/components/Navigation";
import { IOS26Footer } from "@/components/iOS26Footer";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Input } from "@/components/ui/input";
import { Movie, Series } from "@shared/schema";
import { Search as SearchIcon, Play, Star, Loader2 } from "lucide-react";
import { updateSEO } from "@/lib/seo";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const { data: movies, isLoading: moviesLoading } = useMovies();
  const { data: series, isLoading: seriesLoading } = useSeries();
  const [playingItem, setPlayingItem] = useState<Movie | Series | null>(null);

  useEffect(() => {
    const siteUrl = window.location.origin;
    const title = query 
      ? `Search Results for "${query}" | HostingAllTV`
      : 'Search Movies & TV Series | HostingAllTV';
    const description = query
      ? `Search results for "${query}" on HostingAllTV. Find movies and TV series matching your query.`
      : 'Search our vast collection of movies and TV series. Find exactly what you\'re looking for on HostingAllTV.';

    updateSEO({
      title,
      description,
      keywords: `search, movies, series, ${query ? `"${query}"` : 'streaming content'}`,
      canonical: query ? `${siteUrl}/search?q=${encodeURIComponent(query)}` : `${siteUrl}/search`,
      ogTitle: title,
      ogDescription: description,
      ogType: 'website'
    });
  }, [query]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const movieResults = movies?.filter(m => 
      m.title.toLowerCase().includes(q) || m.genre.toLowerCase().includes(q)
    ) || [];
    const seriesResults = series?.filter(s => 
      s.title.toLowerCase().includes(q) || s.genre.toLowerCase().includes(q)
    ) || [];
    return [...movieResults, ...seriesResults];
  }, [query, movies, series]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 overflow-x-hidden">
      <Navigation />
      
      <div className="pt-28 px-6 md:px-12">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Search Input Section - iOS 26 Style */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-5 md:left-6 flex items-center pointer-events-none z-10">
              <svg className="w-5 h-5 text-white/60 group-focus-within:text-white/80 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Movies, Series, Genres..."
              className="w-full h-12 pl-14 pr-6 bg-white/5 backdrop-blur-3xl border border-white/15 rounded-full text-base md:text-lg font-medium text-white placeholder:text-white/35 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:border-transparent transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:bg-white/8 hover:border-white/25"
              autoFocus
            />
          </div>

          {/* Results Grid */}
          <div className="space-y-8">
            {query && (
              <h2 className="text-xl font-display font-medium text-white/60">
                {results.length} results for "{query}"
              </h2>
            )}

            {(moviesLoading || seriesLoading) ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((item) => (
                  <div
                    key={`${'videoUrl' in item ? 'movie' : 'series'}-${item.id}`}
                    className="relative group cursor-pointer transition-all duration-300"
                    onClick={() => setPlayingItem(item)}
                  >
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-white/5 group-hover:scale-105 transition-all duration-500 shadow-xl">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white text-black rounded-full p-4 mb-3 shadow-[0_25px_60px_rgba(255,255,255,0.35)] scale-0 group-hover:scale-100 transition-transform duration-300 hover:shadow-[0_30px_70px_rgba(255,255,255,0.45)]">
                          <Play className="w-6 h-6 fill-black" />
                        </div>
                        <h3 className="text-white font-bold text-center text-sm line-clamp-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1.5 text-white/80 text-xs">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {query && results.length === 0 && !moviesLoading && (
              <div className="text-center py-20 space-y-4">
                <div className="text-white/20 flex justify-center">
                  <SearchIcon className="w-16 h-16" />
                </div>
                <p className="text-white/40 text-xl">No results found. Try something else.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {playingItem && (
        <VideoPlayer
          isOpen={!!playingItem}
          onClose={() => setPlayingItem(null)}
          videoUrl={'videoUrl' in playingItem ? playingItem.videoUrl : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
          title={playingItem.title}
        />
      )}

      <IOS26Footer />
    </div>
  );
}
