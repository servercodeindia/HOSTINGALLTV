import { Movie, Series } from "@shared/schema";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";

interface ContentRowProps {
  title: string;
  items: (Movie | Series)[];
  onItemClick: (item: Movie | Series) => void;
  showTrendingBadge?: boolean;
}

export function ContentRow({ title, items, onItemClick, showTrendingBadge }: ContentRowProps) {
  if (items.length === 0) return null;

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="py-8 space-y-4 group/row relative overflow-visible">
      <div className="px-6 md:px-12 flex items-center justify-between flex-wrap gap-3 overflow-visible">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl font-display font-semibold text-white/90 hover:text-white transition-colors cursor-pointer">
            {title}
          </h2>
          {showTrendingBadge && (
            <span className="px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-full text-xs font-bold text-red-400 animate-pulse backdrop-blur-sm whitespace-nowrap">
              TRENDING
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <Button
            size="icon"
            variant="ghost"
            onClick={scrollPrev}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={scrollNext}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6 px-6 md:px-12 py-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex-[0_0_200px] md:flex-[0_0_280px] min-w-0 group cursor-pointer transition-all duration-300"
              onClick={() => onItemClick(item)}
            >
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg bg-card border border-white/5 group-hover:shadow-2xl group-hover:shadow-primary/20 group-hover:scale-105 group-hover:-translate-y-2 transition-all duration-300 ease-out">
                {/* Poster Image */}
                <img
                  src={item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white text-black rounded-full p-5 mb-4 shadow-[0_25px_60px_rgba(255,255,255,0.35)] scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 hover:shadow-[0_30px_70px_rgba(255,255,255,0.45)]">
                    <Play className="w-7 h-7 fill-black" />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-white/80 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-150">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span>{item.rating}</span>
                    <span>•</span>
                    <span>{item.genre}</span>
                  </div>
                </div>
              </div>
              {/* Title below card */}
              <div className="mt-3 px-1">
                <h3 className="text-white font-medium text-sm md:text-base line-clamp-2 min-h-[2.5rem] md:min-h-[3rem] group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-white/40 text-xs mt-0.5">{item.genre}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
