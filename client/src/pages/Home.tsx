import { useMovies } from "@/hooks/use-movies";
import { useSeries } from "@/hooks/use-series";
import { Navigation } from "@/components/Navigation";
import { HeroCarousel } from "@/components/HeroCarousel";
import { ContentRow } from "@/components/ContentRow";
import { VideoPlayer } from "@/components/VideoPlayer";
import { IOS26Footer } from "@/components/iOS26Footer";
import { useState, useEffect } from "react";
import { Movie, Series } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { updateSEO, addStructuredData, getOrganizationStructuredData } from "@/lib/seo";

export default function Home() {
  const { data: movies, isLoading: moviesLoading } = useMovies();
  const { data: series, isLoading: seriesLoading } = useSeries();
  const [playingItem, setPlayingItem] = useState<Movie | Series | null>(null);

  useEffect(() => {
    const siteUrl = window.location.origin;
    updateSEO({
      title: 'HostingAllTV - Stream Movies & TV Series Online | Premium Streaming Platform',
      description: 'Watch thousands of movies and TV series online on HostingAllTV. Stream your favorite content in HD quality. No ads, unlimited streaming. Start watching now!',
      keywords: 'movies, series, streaming, watch online, TV shows, cinema, entertainment, HostingAllTV',
      canonical: siteUrl,
      ogTitle: 'HostingAllTV - Your Favorite Movies & TV Series',
      ogDescription: 'Stream unlimited movies and TV series. High quality content. Watch anytime, anywhere.',
      ogImage: movies?.[0]?.posterUrl,
      ogType: 'website'
    });
    addStructuredData(getOrganizationStructuredData(siteUrl));
  }, [movies]);

  if (moviesLoading || seriesLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const featuredMovies = movies?.filter(m => m.isFeatured) || [];
  
  // Use trending movies for the slidable banner if available, otherwise featured
  const trendingMovies = movies?.filter(m => m.isTrending) || [];
  const bannerItems = trendingMovies.length > 0 ? trendingMovies : (featuredMovies.length > 0 ? featuredMovies : (movies?.slice(0, 5) || []));

  const trendingContent = [
    ...(movies?.filter(m => m.isTrending) || []),
    ...(series?.filter(s => s.isTrending) || [])
  ];

  const actionMovies = movies?.filter(m => m.genre.includes("Action")) || [];
  const dramaSeries = series?.filter(s => s.genre.includes("Drama")) || [];

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 overflow-x-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <HeroCarousel 
        items={bannerItems as Movie[]} 
        onPlay={(item) => setPlayingItem(item)} 
      />

      {/* Content Rows */}
      <div className="relative z-10 space-y-8 pt-12 md:pt-16">
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <ContentRow 
            title="Trending Now" 
            items={trendingContent} 
            onItemClick={(item) => setPlayingItem(item)} 
            showTrendingBadge={true}
          />
        </div>
        
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <ContentRow 
            title="Action Movies" 
            items={actionMovies} 
            onItemClick={(item) => setPlayingItem(item)} 
          />
        </div>

        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <ContentRow 
            title="Drama Series" 
            items={dramaSeries} 
            onItemClick={(item) => setPlayingItem(item)} 
          />
        </div>
        
        <div className="container max-w-7xl mx-auto px-6 md:px-12">
          <ContentRow 
            title="All Movies" 
            items={movies || []} 
            onItemClick={(item) => setPlayingItem(item)} 
          />
        </div>
      </div>

      {/* Video Player Modal */}
      {playingItem && (
        <VideoPlayer
          isOpen={!!playingItem}
          onClose={() => setPlayingItem(null)}
          videoUrl={'videoUrl' in playingItem ? playingItem.videoUrl : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
          title={playingItem.title}
        />
      )}

      {/* iOS 26 Footer */}
      <IOS26Footer />
    </div>
  );
}
