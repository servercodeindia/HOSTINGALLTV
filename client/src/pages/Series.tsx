import { useSeries } from "@/hooks/use-series";
import { Navigation } from "@/components/Navigation";
import { ContentRow } from "@/components/ContentRow";
import { VideoPlayer } from "@/components/VideoPlayer";
import { IOS26Footer } from "@/components/iOS26Footer";
import { useState, useEffect } from "react";
import { Movie, Series } from "@shared/schema";
import { Loader2, MonitorPlay } from "lucide-react";
import { updateSEO, addStructuredData } from "@/lib/seo";

export default function SeriesPage() {
  const { data: series, isLoading } = useSeries();
  const [playingItem, setPlayingItem] = useState<Movie | Series | null>(null);

  useEffect(() => {
    const siteUrl = window.location.origin;
    updateSEO({
      title: 'Watch TV Series Online | HostingAllTV - Binge-Watch Your Favorites',
      description: 'Stream your favorite TV series on HostingAllTV. Latest episodes, classic shows, and exclusive series. Watch unlimited content in HD quality!',
      keywords: 'watch TV series, TV shows online, binge watch, series streaming, HostingAllTV series',
      canonical: `${siteUrl}/series`,
      ogTitle: 'TV Series - Stream Now | HostingAllTV',
      ogDescription: 'Watch unlimited TV series and shows in HD quality on HostingAllTV',
      ogImage: series?.[0]?.posterUrl,
      ogType: 'website'
    });

    if (series && series.length > 0) {
      const seriesData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'TV Series Collection',
        description: 'Browse our collection of TV series',
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: series.slice(0, 10).map((show, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'TVSeries',
              name: show.title,
              image: show.posterUrl,
              url: `${siteUrl}/series?id=${show.id}`
            }
          }))
        }
      };
      addStructuredData(seriesData);
    }
  }, [series]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-white">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const genres = Array.from(new Set(series?.map(s => s.genre) || []));

  return (
    <div className="min-h-screen bg-background text-foreground pb-32 overflow-x-hidden">
      <Navigation />
      
      <div className="pt-32 px-6 md:px-12 mb-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-blue-600/20 rounded-2xl">
            <MonitorPlay className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white">Series</h1>
            <p className="text-muted-foreground">Discover epic stories</p>
          </div>
        </div>

        <div className="space-y-12">
          {genres.map(genre => (
            <div key={genre}>
              <ContentRow 
                title={genre} 
                items={series?.filter(s => s.genre === genre) || []} 
                onItemClick={(item) => setPlayingItem(item)} 
              />
            </div>
          ))}

          <ContentRow 
            title="All Series" 
            items={series || []} 
            onItemClick={(item) => setPlayingItem(item)} 
          />
        </div>
      </div>

      {playingItem && (
        <VideoPlayer
          isOpen={!!playingItem}
          onClose={() => setPlayingItem(null)}
          videoUrl={"http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
          title={playingItem.title}
        />
      )}

      <IOS26Footer />
    </div>
  );
}
