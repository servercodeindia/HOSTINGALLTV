import { useMovies } from "@/hooks/use-movies";
import { Navigation } from "@/components/Navigation";
import { ContentRow } from "@/components/ContentRow";
import { VideoPlayer } from "@/components/VideoPlayer";
import { IOS26Footer } from "@/components/iOS26Footer";
import { useState, useEffect } from "react";
import { Movie, Series } from "@shared/schema";
import { Loader2, Clapperboard } from "lucide-react";
import { updateSEO, addStructuredData } from "@/lib/seo";

export default function MoviesPage() {
  const { data: movies, isLoading } = useMovies();
  const [playingItem, setPlayingItem] = useState<Movie | Series | null>(null);

  useEffect(() => {
    const siteUrl = window.location.origin;
    updateSEO({
      title: 'Watch Movies Online | HostingAllTV - Unlimited Streaming',
      description: 'Browse and watch thousands of movies online on HostingAllTV. From action to drama, find your next favorite film. Stream in HD now!',
      keywords: 'watch movies online, movie streaming, free movies, HD movies, cinema, HostingAllTV movies',
      canonical: `${siteUrl}/movies`,
      ogTitle: 'Movies - Watch Online | HostingAllTV',
      ogDescription: 'Stream unlimited movies in HD quality on HostingAllTV',
      ogImage: movies?.[0]?.posterUrl,
      ogType: 'website'
    });
    
    if (movies && movies.length > 0) {
      const moviesData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Movies Collection',
        description: 'Browse our collection of movies',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: movies.slice(0, 10).map((movie, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Movie',
              name: movie.title,
              image: movie.posterUrl,
              url: `${siteUrl}/movies?id=${movie.id}`
            }
          }))
        }
      };
      addStructuredData(moviesData);
    }
  }, [movies]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // Group movies by genre for a better layout
  const genres = Array.from(new Set(movies?.map(m => m.genre) || []));

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 overflow-x-hidden">
      <Navigation />
      
      <div className="pt-32 px-6 md:px-12 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600/20 rounded-2xl">
            <Clapperboard className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Movies</h1>
            <p className="text-muted-foreground">Browse our entire collection</p>
          </div>
        </div>

        <div className="space-y-12">
          {genres.map(genre => (
            <div key={genre}>
              <ContentRow 
                title={genre} 
                items={movies?.filter(m => m.genre === genre) || []} 
                onItemClick={(item) => setPlayingItem(item)} 
              />
            </div>
          ))}

          <ContentRow 
            title="All Movies" 
            items={movies || []} 
            onItemClick={(item) => setPlayingItem(item)} 
          />
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
